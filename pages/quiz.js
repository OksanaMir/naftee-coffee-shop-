import Head from "next/head";
import { QuizForm } from "../components/quiz/QuizForm";
import { useRouter } from "next/router";
import { request } from "../lib/datoCMS";
import { useEffect, useRef, useState } from "react";
import { Button, Result } from "antd";
import { CoffeeOutlined } from "@ant-design/icons";
import { Layout } from "../components/layout/Layout";
import styles from "../styles/Quiz.module.scss";
import { useTranslation } from "react-i18next";
import { ResultBlock } from "../components/quiz/QuizResultBlock";

export default function QuizPage({ quizData }) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [isFinished, setIsfinished] = useState(false);
  const [product, setProduct] = useState(null);
  const [answers, setAnswers] = useState({
    method: "",
    package: "",
    coffeeSort: "",
  });
  const ref = useRef(false);

  useEffect(() => {
    if (answers.coffeeSort) {
      if (!ref.current) {
        ref.current = true;
        request({
          query: PRODUCT_QUERY,
          variables: {
            filter: { id: { eq: answers.coffeeSort } },
            locale: router.locale === "CZ" ? "cs" : "en",
          },
        })
          .then((response) => {
            console.log(response.product);
            setProduct(response.product);
            setIsfinished(true);
          })
          .catch(console.error);
      }
    }
  }, [answers.coffeeSort]);

  const onFinished = (ans) => {
    setAnswers(ans);
  };

  return (
    <>
      <Head>
        <title>Quiz</title>
      </Head>
      <Layout>
        <section className={styles.quizContainer}>
          {!isFinished ? (
            <div className={styles.quest}>
              <h1 className={styles.question}>How to choose coffee?</h1>
              <h3 className={styles.invitation}>
                Answer the questions below to make your choice easier.
              </h3>
              <QuizForm
                quiz={quizData?.allCoffeeQuizzes}
                onFinished={onFinished}
                answers={answers}
                setAnswers={setAnswers}
              />
            </div>
          ) : (
            <>
              <div className={styles.result}>
                {product && (
                  <Result
                    icon={<CoffeeOutlined />}
                    title="Thank you for answering questions!"
                    subTitle={"Test"}
                    extra={[
                      <Button type="primary" key="home">
                        {t("quiz.back")}
                      </Button>,
                    ]}
                    // extra={[
                    //   <Button onClick={goBackInHistory} type="primary" key="home">
                    //     {t('quiz.back')}
                    //   </Button>,
                    //   <Button
                    //     onClick={(window.location.href = '/shop/shop-list')}
                    //     key="buy"
                    //   >
                    //     {t('quiz.buy')}
                    //   </Button>,
                    // ]}
                  />
                )}
              </div>
              ]
              <ResultBlock product={product} answers={answers} />
            </>
          )}
        </section>
      </Layout>
    </>
  );
}

export async function getStaticProps(context) {
  const { locale } = context;
  const quizData = await request({
    query: QUIZ_QUERY,
    variables: { locale: locale === "cs" ? "cs_CZ" : "en" },
  });

  return {
    props: {
      quizData,
    },
  };
}

const QUIZ_QUERY = `query QuizQuery($locale: SiteLocale)
{
  allCoffeeQuizzes(locale:$locale) {
      id
      question
      option
      instruction
      recommendation
    } 
}`;

const PRODUCT_QUERY = `query ProductQuery($filter: ProductModelFilter, $locale: SiteLocale){
  product(filter: $filter, locale:$locale) {
    productName
    id
    quantityWeight 
    horizontalProductView {
      alt
      id
      url
      title
      width
      height
    }

  }}`;
