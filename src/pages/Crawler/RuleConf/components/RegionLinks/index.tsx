import React, { Component } from 'react';
import { connect } from 'dva';
import { Col, Dropdown, Icon, Input, List, Menu, Row, Collapse, Select } from 'antd';
import { Dispatch } from 'redux';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

import {
  RegionLinksItem,
  RegionLinksStateType,
} from '@/pages/Crawler/RuleConf/models/components/regionLinks';
import LinksParams from './LinksParams';

import styles from './style.less';

interface RegionLinksProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  regionLinks: RegionLinksStateType;
  regionId: string;
}

interface RegionLinksState {
  editingRecord: RegionLinksItem | null;
}

class RegionLinks extends Component<RegionLinksProps, RegionLinksState> {
  componentWillMount(): void {
    const { dispatch, regionId } = this.props;

    dispatch({
      type: 'regionLinks/fetch',
      payload: {
        regionId,
      },
    });
  }

  renderLinksList() {
    const {
      regionLinks: { data },
    } = this.props;

    const header = (
      <>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Icon type="folder-open" />
          <span style={{ display: 'inline-flex', flexFlow: 'column', marginLeft: 10 }}>
            <span>详情页</span>
            <span>1 request</span>
          </span>
        </div>
      </>
    );

    const { list } = data;

    const menu = (
      <Menu>
        <Menu.Item key="1">
          <span>
            <Icon type="copy" theme="filled" />
            <span>Duplicate</span>
          </span>
        </Menu.Item>
        <Menu.Item key="2">
          <span>
            <Icon type="delete" theme="filled" />
            <span>
              <FormattedMessage id="component.common.text.delete" />
            </span>
          </span>
        </Menu.Item>
      </Menu>
    );

    return (
      <div>
        <Collapse
          defaultActiveKey={['1']}
          expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          className={styles.linksCategory}
        >
          <Collapse.Panel header={header} key="1">
            <List
              itemLayout="horizontal"
              size="small"
              dataSource={list}
              bordered
              renderItem={item => (
                <List.Item title={item.name} className={styles.linksListItem}>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <div
                      style={{
                        flex: '0 0 50px',
                        fontWeight: 'bold',
                        fontSize: 'xx-small',
                        color: 'green',
                      }}
                    >
                      DELETE
                    </div>
                    <div
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: '1 1 auto',
                      }}
                    >
                      {item.name}
                    </div>
                    <div>
                      <Dropdown overlay={menu}>
                        <a>
                          <Icon type="ellipsis" />
                        </a>
                      </Dropdown>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Collapse.Panel>
        </Collapse>
      </div>
    );
  }

  render() {
    return (
      <Row style={{ height: '100%' }}>
        <Col xs={24} sm={24} md={24} lg={6} xl={6} style={{ height: '100%' }}>
          <div className={styles.left}>
            <div className={`${styles.searchCard} ${styles.card} ${styles.cardHeader}`}>
              <Input prefix={<Icon type="search" />} placeholder="Filter" />
            </div>
            <div className={`${styles.card} ${styles.cardHeader}`}>
              <a>
                <Icon type="plus" /> New Links
              </a>
            </div>
            {this.renderLinksList()}
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={18} xl={18} style={{ height: '100%' }}>
          <div className={styles.right}>
            <div className={styles.linkName}>
              <Collapse
                expandIcon={({ isActive }) => (
                  <Icon type="caret-right" rotate={isActive ? 90 : 0} />
                )}
              >
                <Collapse.Panel
                  header={
                    <Input placeholder="点击输入链接名称" onClick={e => e.stopPropagation()} />
                  }
                  key="1"
                >
                  <Input.TextArea placeholder={formatMessage({ id: 'app.common.label.memo' })} />
                </Collapse.Panel>
              </Collapse>
            </div>
            <div className={styles.linkSelector}>
              <Input.Group compact>
                <Select defaultValue="GET" style={{ width: 100 }}>
                  <Select.Option value="GET">GET</Select.Option>
                  <Select.Option value="POST">POST</Select.Option>
                  <Select.Option value="PUT">PUT</Select.Option>
                  <Select.Option value="DELETE">DELETE</Select.Option>
                </Select>
                <Input style={{ width: 'calc(100% - 100px)' }} placeholder="Link Selector" />
              </Input.Group>
            </div>
            {<LinksParams />}
          </div>
        </Col>
      </Row>
    );
  }
}

export default connect(
  ({
    regionLinks,
    loading,
  }: {
    regionLinks: RegionLinksStateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    regionLinks,
    loading: loading.models.regionLinks,
  }),
)(RegionLinks);
