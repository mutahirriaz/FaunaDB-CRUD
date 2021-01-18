import React, { useEffect, useState } from 'react';
import { Form, Formik, Field, ErrorMessage, yupToFormErrors } from 'formik';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import UpdateIcon from '@material-ui/icons/Update'
import { Button, Grid, TextField, ListItemText, List, ListItemSecondaryAction, Modal, IconButton } from '@material-ui/core';
import * as Yup from 'yup';
import styles from './todo.module.css';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            textAlign: 'center',
        },
        parent: {
            textAlign: 'center'
        },
        dataDisplay: {
            backgroundColor: '#eeeeee',
            marginBottom: '10px'
        },
        textField: {
            width: '100%',
            textAlign: 'center',
        },
        paper: {
            position: 'absolute',
            width: 400,
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
    }),
);

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 40 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}


function Todo() {
    const classes = useStyles();

    // Modal
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const schema = Yup.object({
        todo: Yup.string()
            .required('Add an item')
            .min(4, 'Must be greater than or equals to 4 characters')
    });



    // states
    const [todo, getTodos] = useState([])
    const [startUseffect, setUseEffect] = useState<boolean>()
    const [open, setOpen] = React.useState(false);
    const [modalStyle] = React.useState(getModalStyle);
    const [updateId, setUpdateId] = useState(null)

    // Read Todos
    const readData = async () => {
        return await fetch(`/.netlify/functions/read_todo`)
            .then(res => res.json())
            .then((data) => {
                return data
            })
    }

    // Delete Todos
    const deleteTodo = async (id) => {
        
        await fetch(`/.netlify/functions/delete_todo`, {
            method: 'DELETE',
            body: JSON.stringify(id)
        })
            .then(res => res.json())
            .then((data) => {
                return data
            })
            .catch(err => err)
    }

    // Update Todo
    const updateTodo = async (todo, id) => {
       
        await fetch(`.netlify/functions/update_todo`, {
            method: 'PUT',
            body: JSON.stringify({ id, todo })
        })
            .then(res => res.json())
            .then(data => {
                return data
            })
    }

    useEffect(() => {
        const fetchData = async () => {
            const data = await readData()
           
            getTodos(data)
            setUseEffect(false)
        }
        fetchData()
    }, [startUseffect])



    return (
        <div className={classes.parent} >
            <Formik initialValues={{
                todo: ''
            }}
            validationSchema={schema}
                onSubmit={(values) => {
                    fetch(`/.netlify/functions/add_todo`, {
                        method: 'post',
                        body: JSON.stringify(values)
                    })
                        .then(res => res.json())
                        .then(data => {
                            return data
                        })
                    setUseEffect(true)
                }}
                
            >
                {
                    (formik) => (
                        <Form onSubmit={formik.handleSubmit} >
                            <div  >
                                <h1>Serverless CRUD</h1>

                                <div className={styles.input} >
                                    <Field as={TextField} type="text" variant="outlined" label="Name" name="todo" id="todo" />
                                    <div>    
                                    <ErrorMessage name="todo" render={(msg) => (
                                        <div style={{ color: "red" }}>{msg}</div>
                                    )} />
                                    </div>
                                </div>

                                <div className={styles.submit_btn} >
                                    <Button color='primary' variant='outlined' type='submit' >Submit</Button>
                                </div>




                            </div>
                        </Form>
                    )
                }
            </Formik>

            <Grid>
                <Grid>

                    <List>
                        {todo.map((item, i) => {
                            return (
                                <div key={i}>

                                    <div className={styles.todo_main_div}>
                                        <div className={styles.todo} >
                                            <p>{ item.data.todo}</p>
                                        </div>

                                        <div className={styles.todo_icon} >
                                            <Button onClick={async () => {
                                                const data = deleteTodo(item.ref['@ref'].id)
                                                setUseEffect(true)
                                            }} >
                                                <DeleteIcon />
                                            </Button>
                                        

                                       
                                            <Button type='submit' onClick={() => {
                                                handleOpen()
                                                setUpdateId(item.ref['@ref'].id)
                                            }}>
                                                <UpdateIcon />
                                            </Button>
                                        </div>
                                    </div>

                                    <ListItemSecondaryAction>
                                        <Modal
                                            open={open}
                                            onClose={handleClose}
                                            aria-labelledby="simple-modal-title"
                                            aria-describedby="simple-modal-description"
                                        >
                                            <div style={modalStyle} className={classes.paper}>
                                                <Formik initialValues={{
                                                    todo: ''
                                                }}
                                                    onSubmit={(values) => {
                                                        updateTodo(values.todo, updateId)
                                                        setUseEffect(true)
                                                    }}
                                                    validationSchema={
                                                        Yup.object({
                                                        todo: Yup.string().required("Required").min(3).max(20)
                                                    })}
                                                >
                                                    {
                                                        (formik) => (
                                                            <Form onSubmit={formik.handleSubmit} >
                                                                <Field as={TextField} variant='outlined' name='todo' label='update Todo' />
                                                                <ErrorMessage name='todo' />
                                                                <div style={{marginTop: '20px'}} >
                                                                    <Button type='submit' color='secondary' variant='outlined' >Update</Button>
                                                                </div>
                                                            </Form>
                                                        )
                                                    }

                                                </Formik>
                                            </div>

                                        </Modal>
                                    </ListItemSecondaryAction>



                                </div>
                            )
                        })}
                    </List>

                </Grid>
            </Grid>


        </div>

    )
}

export default Todo
