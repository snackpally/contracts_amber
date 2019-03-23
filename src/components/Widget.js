import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import LoadingSmall from "./LoadingSmall.js";
import Zoom from '@material-ui/core/Zoom';




const Widget = (props) => {
  return props.loading ?  <LoadingSmall/> :
    <Zoom in={!props.loading} timeout={{enter: 600}}>
      <Card > 
        <CardContent>
          {props.icon}
          <Typography variant="h5">
            {props.title}
          </Typography>
          <Typography variant="subtitle2">
            {props.secondary}
          </Typography>
          <Typography variant="body2">
            {props.body}
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant="contained" color="primary" size="small" component={Link} to={props.actionLink}>{props.action}</Button>
        </CardActions>
      </Card>
    </Zoom>;
};
export default Widget;