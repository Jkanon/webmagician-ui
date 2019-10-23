import React, { Component } from 'react';
import { connect } from 'dva';
import { Col, Icon, Input, List, Row, Collapse } from 'antd';
import { Dispatch } from 'redux';

import {
  RegionLinksItem,
  RegionLinksStateType,
} from '@/pages/Crawler/RuleConf/models/components/regionLinks';

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

  render() {
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

    return (
      <Row>
        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
          <div className="ant-card-bordered">
            <div className={`${styles.searchInput} ${styles.card} ${styles.cardHeader}`}>
              <Input prefix={<Icon type="search" />} placeholder="Filter" />
            </div>
            <div className={`${styles.card} ${styles.cardHeader}`}>
              <a>
                <Icon type="plus" /> New Links
              </a>
            </div>
            <div>
              <Collapse
                defaultActiveKey={['1']}
                expandIcon={({ isActive }) => (
                  <Icon type="caret-right" rotate={isActive ? 90 : 0} />
                )}
                className={styles.linksCategory}
              >
                <Collapse.Panel header={header} key="1">
                  <List
                    itemLayout="horizontal"
                    size="small"
                    dataSource={list}
                    bordered
                    renderItem={item => (
                      <List.Item>
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
                            <Icon type="ellipsis" />
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                </Collapse.Panel>
              </Collapse>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={18} xl={18}>
          <div className="ant-card-bordered" style={{ borderLeft: 0 }}>
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
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
