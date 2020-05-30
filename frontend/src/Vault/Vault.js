import React, {useState, useEffect} from 'react';
import Grid from "@material-ui/core/Grid";
import GridList from "@material-ui/core/GridList";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {DropdownButton, Dropdown} from "react-bootstrap";
import axios from "axios";
import VaultModal from "../VaulModal/VaultModal";
import db from "../VaultDb"
import AES from "crypto-js/aes"
import * as CryptoJS from 'crypto-js'
import VaultItem from "../VaultItem/VaultItem";
import clsx from "clsx";

const drawerWidth = 0;

const styles = makeStyles(theme => ({
    gridPadding: {
        paddingTop: '30px'
    },
    vaultGrid: {
        display: 'flex',
    },
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
}));

const decryptMessage = (message, secretKey) => {
    console.log(message);
    const decryptedMessage = AES.decrypt(message, secretKey);
    console.log(decryptedMessage);
    return decryptedMessage;
};

function Vault(props) {
    const [vaultData, setData] = useState([]);
    const [vaultState, setState] = useState({
        updated: false
    });
    useEffect(() => {
        async function FetchVaultItems() {
            let unencryptedData = [];
            const result = await axios.get('/api/v1/vault/retrieve_vault/');
            if(result.data.length >= 1) {
                let vault_key = await db.vault_key.where("username").equalsIgnoreCase(localStorage.getItem("email")).first();
                unencryptedData = result.data.map(x => {
                    return {
                        ...x,
                        password: decryptMessage(x.password, vault_key['key']).toString(CryptoJS.enc.Utf8)
                    }
                });
            }
            setData(unencryptedData);
            setState({
                ...vaultState,
                updated: false
            });
        }
        FetchVaultItems();
    }, [vaultState.updated]);

    const classes = styles();

    const vault_items = vaultData.map((item) => {
        return (
            <VaultItem domain={item.domain} username={item.username} password={item.password} key={item.id} vaultState={vaultState} setState={setState} itemId={item.id}/>
        )
    });

    return (
        <div className={clsx(classes.content, {
            [classes.contentShift]: props.open,
        })}>
            <div className={classes.vaultGrid}>
                <Grid container justify={'flex-end'} spacing={2} direction={'row'} item>
                    <Grid item>
                        <DropdownButton id="dropdown-basic-button" title="Sort By:" variant="secondary" size="sm">
                            <Dropdown.Item>Action</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                        </DropdownButton>
                    </Grid>
                </Grid>
            </div>
            <div className={classes.gridPadding}>
                <Grid container direction={"row"} spacing={0} alignItems={"flex-end"}>
                    <Grid item style={{width: "90%"}}>
                        <GridList cellHeight={250} cols={4} spacing={15}>
                            {vault_items}
                        </GridList>
                    </Grid>
                    <Grid item>
                        <VaultModal vaultState={vaultState} setState={setState}/>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

export default Vault;
