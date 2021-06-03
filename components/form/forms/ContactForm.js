import { Form, Input, Button } from 'antd';
import 'antd/dist/antd.css';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import styles from '../../../styles/ContactForm.module.scss';
export function ContactForm() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { SiteClient } = require('datocms-client');
  const client = new SiteClient('dcf7c70ca6f6fb69721273dbc749b3');

  async function createRecord() {
    const record = await client.items.create({
      itemType: '801810', // model ID
      user_email: form.getFieldsValue().user_email,
      user_name: form.getFieldsValue().user_name,
      subject: form.getFieldsValue().subject,
      message: form.getFieldsValue().message,
    });
  }
  useEffect(() => {
    console.log(form.getFieldsValue(), 'hdskds');
  }, [form]);

  const onFinish = (values) => {
    console.log('Success:', values);
    createRecord();
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };
  return (
    <Form
      form={form}
      {...layout}
      id={'area'}
      name="contacts"
      className={styles.form}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label={t('contacts.userName')}
        name={'user_name'}
        rules={[{ required: true, message: t('message.userNameIsRequired') }]}
      >
        <Input placeholder={t('contacts.userName')} />
      </Form.Item>
      <Form.Item
        label={t('contacts.email')}
        name="user_email"
        rules={[
          {
            type: 'email',
            required: true,
            message: t('message.emailIsRequired'),
          },
        ]}
      >
        <Input placeholder={t('contacts.email')} />
      </Form.Item>
      <Form.Item
        label={t('contacts.subject')}
        name={'subject'}
        rules={[
          {
            type: 'string',
            required: true,
            message: t('message.subjectIsRequired'),
          },
        ]}
      >
        <Input placeholder={t('contacts.subject')} />
      </Form.Item>
      <Form.Item
        label={t('contacts.message')}
        name="message"
        rules={[
          {
            type: 'string',
            required: true,
            message: t('message.messageIsRequired'),
          },
        ]}
      >
        <Input.TextArea placeholder={t('contacts.message')} />
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit">
          {t('contacts.button')}
        </Button>
      </Form.Item>
    </Form>
  );
}
