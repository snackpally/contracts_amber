import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SideBar from "./SideBar.js";
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import theme from  '../styles/muiTheme.js';


const styles = theme => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
	header : {
		"textAlign": "center",
		"background": "rgba(255,255,255,.75)",
		"paddingBottom": 10
	}
});


class NewContractCards extends React.Component {

  render() {
    const { classes } = this.props;

    return (

      <SideBar>
        <MuiThemeProvider theme={theme}>

        <div className={classes.root}>
        <Grid container className={classes.root} spacing={8}>

          <Grid item xs={12}>
            <Typography variant="h4">Create New Contract</Typography>
          </Grid>
            
          <Grid item xs={12}>
            <Card className={classes.card}>
              <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Service Contract
                  </Typography>

                    <Typography gutterBottom>
                      This contract allows you enter into a service agreement with
                      another party. First, the service provider creates the contract.
                      After contract deployment, the person receiving the service will
                      be prompted to add funds to it. After the services are rendered,
                      both parties must finalize the contract in their dashboards.
                      Once finalized, the funds will be transferred.
                    </Typography>

                <Button variant="contained" color="primary" className={classes.button} component={Link} to='/deploy/service_agreement'>
                  Create This Contract
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Rainy Day Contract
                </Typography>
                <Typography className={classes.secondaryHeading} />
                <Typography gutterBottom="5">
                  This contract allows you to hold money for a rainy day in a city of
                  your choosing. Once the weather report shows that it’s raining in
                  that city, the money will transferred into your account for you to
                  enjoy your rainy day.
                </Typography>
                <Button variant="contained" color="primary" className={classes.button} component={Link} to='/deploywithvalue/rainy_day'>
                    Create This Contract
                </Button>
              </CardContent>
            </Card>
          </Grid>

</Grid>
        </div>
        </MuiThemeProvider>
      </SideBar>
    );
  }
}

NewContractCards.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NewContractCards);

