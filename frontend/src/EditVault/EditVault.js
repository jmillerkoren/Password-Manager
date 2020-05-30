import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

const styles = makeStyles(theme => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 320,
    },
    inputOutline: {
        borderColor: '#3F51B5 !important',
    },
    text: {
        color: 'white'
    },
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly'
    },
    textField: {
        width: '25%'
    }
}));

function EditVault(props) {
    const classes = styles();

    return (
        <div className={clsx(classes.content, {
            [classes.contentShift]: props.open,
        })}>
            <h1>Editing item</h1>
            <form className={classes.root} >
                <TextField label={"Domain"} variant={'outlined'} className={classes.textField} InputLabelProps={{className: classes.text}} InputProps={{classes: {
                    notchedOutline: classes.inputOutline,
                    root: classes.text,
                    }}}
                />
                <TextField label={"Username"} variant={'outlined'} InputLabelProps={{className: classes.text}} InputProps={{classes: {
                        notchedOutline: classes.inputOutline,
                        root: classes.text,
                    }}}
                />
                <TextField label={"Password"} variant={'outlined'} InputLabelProps={{className: classes.text}} InputProps={{classes: {
                        notchedOutline: classes.inputOutline,
                        root: classes.text,
                    }}}
                />
            </form>
        </div>
    )
}

export default EditVault;
