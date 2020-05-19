import React, {useState} from "react";
import Card from "@material-ui/core/Card/Card";
import lock from "../icons8-lock.svg";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import GridListTile from "@material-ui/core/GridListTile";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";
import {ThemeProvider, createMuiTheme} from "@material-ui/core/styles"

const styles = makeStyles(theme => ({
    root: {
        height: '100%',
        width: '100%'

    },
    gridPadding: {
        paddingTop: '30px'
    },
    vaultGrid: {
        display: 'flex'
    },
    itemLogo: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#414E9F',
        height: '60%'

    },
    companyLogo: {
        display: 'flex',
        justifyContent: 'center',
        height: '60%',
    },
    opacity: {
        opacity: 0.8,
        backgroundColor: '#414E9F'
    },
    itemHovered: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '60%'

    },
    editButton: {
        width: 150,
        height: 50,
    },
    logo: {
        width: '65%',
        height: 'auto'
    }
}));

const reqSvgs = require.context('../Logos', true, /\.svg$/ );
const paths = reqSvgs.keys();

const svgs = paths.map( path => reqSvgs ( path ) )
console.log(svgs);

const theme = createMuiTheme({
    palette: {primary: {main: '#2c387e'}, secondary: {main: '#1a237e'}}
});

function VaultItem(props) {
    const [entered, changeEntered] = useState(false);
    let classes = styles();

    const mouseEnter = (evt) => {
        changeEntered(true);
    };

    const mouseExit = (evt) => {
        changeEntered(false)
    };

    if(entered) {
        return (
            <GridListTile style={{...props.style}} onMouseEnter={mouseEnter} onMouseLeave={mouseExit}>
                <Card className={classes.root}>
                    <div className={[classes.itemHovered, classes.opacity].join(' ')}>
                        <ThemeProvider theme={theme}>
                            <Button variant="contained" color="secondary" classes={{root: classes.editButton}}>
                                Edit
                            </Button>
                        </ThemeProvider>
                    </div>
                    <CardContent>
                        <Typography variant="h6" component="h2">
                            {props.domain}
                        </Typography>
                        <Typography variant="h6" component="h2">
                            {props.username}
                        </Typography>
                    </CardContent>
                </Card>
            </GridListTile>
        )
    }

    if (!entered) {
        let domainName = props.domain.split('.')
        let correctSvg = svgs.find(x => x.includes(domainName[0]));
        if(correctSvg) {
            return (
                <GridListTile style={{...props.style}} onMouseEnter={mouseEnter} onMouseLeave={mouseExit}>
                    <Card className={classes.root}>
                        <div className={classes.companyLogo}>
                            <img src={correctSvg} className={classes.logo}/>
                        </div>
                        <CardContent>
                            <Typography variant="h6" component="h2">
                                {props.domain}
                            </Typography>
                            <Typography variant="h6" component="h2">
                                {props.username}
                            </Typography>
                        </CardContent>
                    </Card>
                </GridListTile>
            )
        }

        return (
            <GridListTile style={{...props.style}} onMouseEnter={mouseEnter} onMouseLeave={mouseExit}>
                <Card className={classes.root}>
                    <div className={classes.itemLogo}>
                        <img src={lock}/>
                    </div>
                    <CardContent>
                        <Typography variant="h6" component="h2">
                            {props.domain}
                        </Typography>
                        <Typography variant="h6" component="h2">
                            {props.username}
                        </Typography>
                    </CardContent>
                </Card>
            </GridListTile>
        )
    }
}

export default VaultItem;
