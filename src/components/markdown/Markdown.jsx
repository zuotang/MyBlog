import React, {useEffect} from 'react';
import ReactMarkdown from 'react-markdown';
import Loadable from 'react-loadable';
import Emoji from 'react-emoji-render';
import classNames from 'classnames';

//import {toAnchor} from './Anchor';
import {getImg} from '_public';

import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
// import RightMenu from '../RightMenu';
import {getAnchor} from './utils';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';



// 使用动态加载包，加快速度
const Graph = Loadable({
  loader: () => import('./Graph'),
  loading: () => 'loading...',
});

const Code = Loadable({
  loader: () => import('./Code'),
  loading: () => 'loading...',
});
const Chart = Loadable({
  loader: () => import('./Chart'),
  loading: () => 'loading...',
});

const styles = theme => ({
  listItem: {
    marginTop: theme.spacing.unit,
  },
  link: {
    color: theme.palette.primary.main,
  },
  checkbox: {
    padding: '0',
    marginRight: 3,
    marginLeft: -30,
  },
  taskListItem: {
    listStyleType: 'none',
    display: 'list-item',
  },
  heading: {
    margin: '32px 0 24px',
  },
  point: {
    position: 'absolute',
    marginTop: -90,
  },
  table:{
    display:'inline-block'
  }
});
const variants = ['h4', 'h5', 'h6', 'subtitle1', 'subtitle2'];
// 渲染自己的markdown元素，其中键表示节点类型，值是React组件。该对象与默认渲染器合并。传递给组件的props不同，具体取决于节点的类型。
const renderers = {
  text: props => <Emoji text={props.children} />,
  heading: withStyles(styles)(({classes, ...props}) => {
    let value = props.children[0].props.value;
    let anchor = getAnchor(value);
    let level = props.level;
    return (
      <Typography gutterBottom variant={variants[level - 1]} className={classes.heading}>
        <a className={classes.point} id={anchor} />
        {props.children}
      </Typography>
    );
  }),
  paragraph: props => (
    <Typography paragraph variant="body1">
      {props.children}
    </Typography>
  ),
  listItem: withStyles(styles)(({classes, checked, ...props}) => (
    <li className={classNames(classes.listItem, checked !== null && classes.taskListItem)}>
      <Typography component="span" variant="body1">
        {checked !== null && <Checkbox checked={checked} className={classes.checkbox} />}
        {props.children}
      </Typography>
    </li>
  )),
  code: props => {
    switch (props.language) {
      case 'mermaid':
        return <Graph {...props} />;
      case 'chart':
        return <Chart {...props} />;
      default:
        return <Code {...props} />;
    }
  },
  link: withStyles(styles)(({classes, ...props}) => (
    <a href={props.href} className={classes.link}>
      {props.children}
    </a>
  )),
  image: ({src, ...props}) => {
    return <img {...props} src={getImg(src)} style={{maxWidth: '100%'}} />;
  },
  table: withStyles(styles)(({classes,children,...props}) => {
    return  <Paper className={classes.table} ><Table>{children}</Table></Paper>;
  }),
  tableHead: TableHead,
  tableBody: TableBody,
  tableRow: TableRow,
  tableCell: ({children,align,...props}) => {
    if(align===null){align=undefined}
    console.log(children,props)
    return  <TableCell align={align}>{children}</TableCell>;
  },
};

function Markdown({children, ...props}) {
  return <ReactMarkdown renderers={renderers}>{children}</ReactMarkdown>;
}

export default React.memo(Markdown);
