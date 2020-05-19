import React, {useState} from "react"
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import {Modal} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import axios from 'axios'
import db from '../VaultDb'
import AES from 'crypto-js/aes'

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        position: 'absolute',
        width: 500,
        height: 500,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    textField: {
        paddingTop: '25px',

    },
    wrapper: {
        display: 'flex',
        justifyContent: 'center'
    }
}));

function VaultModal(props) {
    const classes = useStyles();
    const [modalState, setModalState] = useState(false);
    const [modalData, setData] = useState({
        domain: '',
        username: '',
        password: ''
    });

    const handleOpen = () => {
        setModalState(true)
    };

    const handleClose = () => {
        setModalState(false)
    };

    const handleChange = (evt) => {
        const value = evt.target.value;
        setData({
            ...modalData,
            [evt.target.name]: value
        })
    };

    const signMessage = (message, secretKey) => {
        const signedPassword = AES.encrypt(message, secretKey);
        return signedPassword;
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        let vault_key = await db.vault_key.where("username").equalsIgnoreCase(localStorage.getItem("email")).first();
        const signedPassword = signMessage(modalData.password, vault_key['key']).toString();
        const apiData = {
            ...modalData,
            password: signedPassword
        };
        const result = await axios.post('/api/v1/vault/add_vault/', apiData);
        if (result.status === 200) {
            props.setState({
                ...props.vaultState,
                updated: true
            });
            handleClose();
        }
    };

    const modalBody = (
        <div className={classes.paper}>
            <Typography variant={'h5'} align={'center'}>
                Enter Domain and Credentials
            </Typography>
            <div className={classes.wrapper}>
                <TextField
                    className={classes.textField}
                    placeholder={'Domain'} name={'domain'}
                    onChange={handleChange}
                    value={modalData.domain}>
                </TextField>
            </div>
            <div className={classes.wrapper}>
                <TextField
                    className={classes.textField}
                    placeholder={'Username/Email'}
                    name={'username'}
                    onChange={handleChange}
                    value={modalData.username}>
                </TextField>
            </div>
            <div className={classes.wrapper}>
                <TextField
                    className={classes.textField}
                    placeholder={'Password'} name={'password'}
                    onChange={handleChange}
                    value={modalData.password}>
                </TextField>
            </div>
            <div className={`${classes.wrapper} ${classes.textField}`} onClick={handleSubmit}>
                <Button variant={'contained'} color={'primary'}>
                    Save
                </Button>
            </div>
        </div>
    );


    return (
        <div>
            <Grid container justify={'flex-start'} direction={'row'} item>
                <Grid item>
                    <Fab color={'primary'} aria-label="add" onClick={handleOpen}>
                        <AddIcon/>
                    </Fab>
                </Grid>
            </Grid>
            <Modal open={modalState} onClose={handleClose} className={classes.modal}>
                {modalBody}
            </Modal>

        </div>
    )
}

export default VaultModal;
