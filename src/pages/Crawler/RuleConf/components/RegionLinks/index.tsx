import React, { Component, ReactNode } from 'react';
import { connect } from 'dva';
import { Col, Dropdown, Icon, Input, List, Menu, Row, Collapse, Select } from 'antd';
import { Dispatch } from 'redux';
import { groupBy } from 'lodash';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import memoize from 'memoize-one';

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

const linkCategories = [
  {
    type: 1,
    name: <FormattedMessage id="app.crawler.rule-conf.label.region.links.type.content-page" />,
  },
  {
    type: 2,
    name: <FormattedMessage id="app.crawler.rule-conf.label.region.links.type.list-page" />,
  },
  {
    type: 3,
    name: <FormattedMessage id="app.crawler.rule-conf.label.region.links.type.extra" />,
  },
  {
    type: 0,
    name: <FormattedMessage id="app.crawler.rule-conf.label.region.links.type.binary" />,
  },
];

class RegionLinks extends Component<RegionLinksProps, RegionLinksState> {
  groupByMemoize = memoize((collection: RegionLinksItem[]) => groupBy(collection, 'type'));

  linksItemsActionMenu = (
    <Menu>
      <Menu.Item key="1">
        <span>
          <Icon type="copy" theme="filled" />
          <span>
            <FormattedMessage id="component.common.text.duplicate" />
          </span>
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

  componentWillMount(): void {
    const { dispatch, regionId } = this.props;

    dispatch({
      type: 'regionLinks/fetch',
      payload: {
        regionId,
      },
    });
  }

  renderCollapseHeader = ({ name }: { name: ReactNode }, list: RegionLinksItem[] = []) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Icon type="folder-open" />
      <span style={{ display: 'inline-flex', flexFlow: 'column', marginLeft: 10 }}>
        <span>{name}</span>
        <span>{list.length} request</span>
      </span>
    </div>
  );

  renderLinksList() {
    const {
      regionLinks: { data },
    } = this.props;

    const { list } = data;
    const dataGroup = this.groupByMemoize(list);

    return (
      <div className={styles.autoFix}>
        <Collapse
          defaultActiveKey={['1']}
          expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          className={styles.linksCategory}
        >
          {linkCategories.map(({ type, name }) => (
            <Collapse.Panel
              header={this.renderCollapseHeader({ name }, dataGroup[type])}
              key={type}
            >
              <List
                itemLayout="horizontal"
                size="small"
                dataSource={dataGroup[type]}
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
                        {item.method}
                      </div>
                      <div
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 'auto',
                        }}
                      >
                        {item.name}
                      </div>
                      <div>
                        <Dropdown overlay={this.linksItemsActionMenu}>
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
          ))}
        </Collapse>
      </div>
    );
  }

  render() {
    return (
      <Row style={{ height: '100%' }}>
        <Col xs={24} sm={24} md={24} lg={6} xl={6} style={{ height: '100%' }}>
          <div className={styles.left}>
            <div>
              <div className={`${styles.searchCard} ${styles.card} ${styles.cardHeader}`}>
                <Input prefix={<Icon type="search" />} placeholder="Filter" />
              </div>
              <div className={`${styles.card} ${styles.cardHeader}`}>
                <a>
                  <Icon type="plus" />{' '}
                  <FormattedMessage id="app.crawler.rule-conf.operation.label.add-link" />
                </a>
              </div>
              {this.renderLinksList()}
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={18} xl={18} style={{ height: '100%' }}>
          <div className={styles.right}>
            <div>
              <div className={styles.linkName}>
                <Collapse
                  expandIcon={({ isActive }) => (
                    <Icon type="caret-right" rotate={isActive ? 90 : 0} />
                  )}
                >
                  <Collapse.Panel
                    header={
                      <Input
                        placeholder="Click here to input the title of the link"
                        onClick={e => e.stopPropagation()}
                      />
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
