import React from "react";
import './nav.css';
import {Redirect, useHistory} from "react-router-dom";
import Cookies from 'js-cookie'
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import {TextField} from "@material-ui/core";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import Grid from "@material-ui/core/Grid";
import {DropdownButton, Dropdown} from "react-bootstrap";
import axios from 'axios'
import db from "../VaultDb";


const drawerWidth = 320;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        height: '64px'
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    searchBar: {
        marginRight: 2

    },
    userDropdown:{

    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
}));

function Nav(props) {
    let history = useHistory();
    const classes = useStyles();
    const theme = useTheme();


    const handleDrawerOpen = () => {
        props.setOpen(true);
    };

    const handleDrawerClose = () => {
        props.setOpen(false);
    };

    const test = (evt) => {
        history.push('/vault')
    };


    const logOut = async () => {
        const result = await axios.post('/api/v1/logout/logout_user/', {});
        let vault_key = await db.vault_key.where("username").equalsIgnoreCase(localStorage.getItem("email")).delete();
        localStorage.removeItem("email");

        props.changeData({
            ...props.userData,
            loggedIn: false,
            email: "",
            password:""
        });
    };

    const filterVault = (evt) => {
        props.setFilter(evt.target.value);
    };

    if (Cookies.get('access_token')) {
        return (
            <div className={classes.root}>
                <AppBar
                    position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: props.open,
                    })}
                >
                    <Toolbar>
                        <Grid container  direction={"row"} alignItems={"center"} spacing={1}>
                            <Grid item={"true"}>
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    onClick={handleDrawerOpen}
                                    edge="start"
                                    className={clsx(classes.menuButton, props.open && classes.hide)}
                                >
                                    <MenuIcon />
                                </IconButton>
                            </Grid>
                            <Grid item={"true"}>
                                <Typography variant="h6" noWrap>
                                    FreePass
                                </Typography>
                            </Grid>
                            <Grid item={"true"} align={"center"}>
                                <TextField
                                    className={useStyles.searchBar}
                                    id="input-with-icon-adornment"
                                    label="Search Vault"
                                    variant="outlined"
                                    onChange={filterVault}
                                />
                            </Grid>
                        </Grid>
                        <Grid container  direction={"row"} alignItems={"center"} spacing={1} justify={"flex-end"}>
                            <Grid item>
                                <DropdownButton id="dropdown-basic-button" title={props.userData.email}>
                                    <Dropdown.Item onClick={logOut}>Logout</Dropdown.Item>                                    
                                </DropdownButton>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={props.open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </div>
                    <Divider/>
                    <List>
                        <ListItem button onClick={test}>
                            <ListItemIcon>{<HomeIcon/>}</ListItemIcon>
                            <ListItemText primary={"Home"}/>
                        </ListItem>                        
                    </List>                                        
                </Drawer>
            </div>

        );
    }

    else{
        return <Redirect to={"/login"}/>;
    }
}
export default Nav;
