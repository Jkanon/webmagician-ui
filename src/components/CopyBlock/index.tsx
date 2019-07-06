import { Icon, Popover, Typography } from 'antd';
import React, { useRef } from 'react';

import { FormattedMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import { isAntDesignPro } from '@/utils/utils';
import styles from './index.less';

const firstUpperCase = (pathString: string): string =>
  pathString
    .replace('.', '')
    .split(/\/|-/)
    .map((s): string => s.toLowerCase().replace(/( |^)[a-z]/g, L => L.toUpperCase()))
    .filter((s): boolean => !!s)
    .join('');

// when  click block copy, send block url to  ga
const onBlockCopy = (label: string) => {
  if (!isAntDesignPro()) {
    return;
  }

  const ga = window && window.ga;
  if (ga) {
    ga('send', 'event', {
      eventCategory: 'block',
      eventAction: 'copy',
      eventLabel: label,
    });
  }
};

const BlockCodeView: React.SFC<{
  url: string;
}> = ({ url }) => {
  const blockUrl = `npx umi block add ${firstUpperCase(url)} --path=${url}`;
  return (
    <div className={styles['copy-block-view']}>
      <Typography.Paragraph
        copyable={{
          text: blockUrl,
          onCopy: () => onBlockCopy(url),
        }}
        style={{
          display: 'flex',
        }}
      >
        <pre>
          <code className={styles['copy-block-code']}>{blockUrl}</code>
        </pre>
      </Typography.Paragraph>
    </div>
  );
};

interface RoutingType {
  location: {
    pathname: string;
  };
}

export default connect(({ routing }: { routing: RoutingType }) => ({
  location: routing.location,
}))(({ location }: RoutingType) => {
  const url = location.pathname;
  const divDom = useRef<HTMLDivElement>(null);
  return (
    <Popover
      title={<FormattedMessage id="app.preview.down.block" defaultMessage="下载此页面到本地项目" />}
      placement="topLeft"
      content={<BlockCodeView url={url} />}
      trigger="click"
      getPopupContainer={dom => (divDom.current ? divDom.current : dom)}
    >
      <div className={styles['copy-block']} ref={divDom}>
        <Icon type="download" />
      </div>
    </Popover>
  );
});
