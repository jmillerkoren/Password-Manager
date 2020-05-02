import React, {useState} from 'react';
import Grid from "@material-ui/core/Grid";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import GridList from "@material-ui/core/GridList";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {DropdownButton, Dropdown} from "react-bootstrap";
import GridListTile from "@material-ui/core/GridListTile";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import axios from "axios";

const styles = makeStyles(theme => ({
    root: {
        minWidth: 200,
    },
    gridPadding: {
        paddingTop: '30px'
    }
}));

function Vault() {
    const classes = styles();
    const testSubmit = async (evt) => {
        const result = axios.post('/api/v1/vault/add_vault/', {
            username: 'testusername',
            password: 'password',
            domain: 'test.ca'
        })
    };

    return (
        <div>
            <Grid container justify={'flex-end'} spacing={2}>
                <Grid item>
                    <ButtonGroup color="primary" aria-label="outlined primary button group">
                        <Button>One</Button>
                        <Button>Two</Button>
                    </ButtonGroup>
                </Grid>
                <Grid item>
                    <DropdownButton id="dropdown-basic-button" title="Sort By:" variant="secondary" size="sm">
                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                    </DropdownButton>
                </Grid>
            </Grid>
            <GridList className={classes.gridPadding} cellHeight={250} cols={4}>
                <GridListTile>
                    <Card className={classes.root} variant="outlined">
                        <CardContent>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Word of the Day
                            </Typography>
                            <Typography variant="h5" component="h2">
                                benevolent
                            </Typography>
                            <Typography className={classes.pos} color="textSecondary">
                                adjective
                            </Typography>
                            <Typography variant="body2" component="p">
                                well meaning and kindly.
                                <br />
                                {'"a benevolent smile"'}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={testSubmit}>Learn More</Button>
                        </CardActions>
                    </Card>
                </GridListTile>
            </GridList>
        </div>
    )
}

export default Vault;
