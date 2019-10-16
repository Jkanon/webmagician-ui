import React, { PureComponent } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { WrappedFormUtils } from 'antd/es/form/Form';

interface EditableCellProps extends FormComponentProps {
  editable: boolean;
  editing: boolean;
  editingRender: (
    text: any,
    record: any,
    index: number,
    title: string,
    dataIndex: string,
    form: WrappedFormUtils,
  ) => React.ReactNode;
  record: any;
  dataIndex: string;
  /* row index */
  index: number;
  title: string;
}

class EditableCell extends PureComponent<EditableCellProps> {
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
    return (
      <td {...restProps}>
        {editing && editingRender
          ? editingRender(record[dataIndex], record, index, title, dataIndex, form)
          : children}
      </td>
    );
  }
}

export default EditableCell;
