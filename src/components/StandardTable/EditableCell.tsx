import React, { PureComponent } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { GetFieldDecoratorOptions, WrappedFormUtils } from 'antd/es/form/Form';
import { Form } from 'antd';

export interface EditingRender {
  fieldDecoratorOptions?: GetFieldDecoratorOptions;
  itemRender: (text: any, record: any, index: number, form?: WrappedFormUtils) => React.ReactNode;
}

interface EditableCellProps extends FormComponentProps {
  editable: boolean;
  editing: boolean;
  editingRender:
    | ((
        text: any,
        record: any,
        index: number,
        title: string,
        dataIndex: string,
        form: WrappedFormUtils,
      ) => React.ReactNode)
    | EditingRender;
  record: any;
  dataIndex: string;
  /* row index */
  index: number;
  title: string;
}

class EditableCell extends PureComponent<EditableCellProps> {
  renderCustom() {
    const { form, editingRender, title, record, index, dataIndex } = this.props;
    const text = record[dataIndex];
    if (typeof editingRender === 'function') {
      return editingRender(record[dataIndex], record, index, title, dataIndex, form);
    }
    const { getFieldDecorator } = form;
    const { fieldDecoratorOptions = {}, itemRender } = editingRender;
    return (
      <Form.Item>
        {getFieldDecorator(dataIndex, {
          initialValue: text,
          // @ts-ignore
          ...fieldDecoratorOptions,
          // @ts-ignore
        })(itemRender())}
      </Form.Item>
    );
  }

  render() {
    const {
      form,
      editable,
      editing,
      editingRender,
      record,
      dataIndex,
      title,
      index,
      children,
      ...restProps
    } = this.props;
    return <td {...restProps}>{editing && editingRender ? this.renderCustom() : children}</td>;
  }
}

export default EditableCell;
