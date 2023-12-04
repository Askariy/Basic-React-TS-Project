import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  Grid,
  TextField,
  Button,
  Box,
  Container,
  Typography,
} from "@mui/material";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Card from "./taskCard";
import { useAuthContext } from "../context/authContext";

const AddTaskSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
});

const Task: React.FC = () => {
  const { user, setUser } = useAuthContext();
  const navigate = useNavigate();

  const configValue: string | undefined = process.env.REACT_APP_API_URL;

  const initialValues = {
    name: "",
  };

  const [cardList, setCardList] = useState<any[]>([]);
  const [checkedCardList, setCheckedCardList] = useState<number[]>([]);

  function handleDeleteTask() {
    // http://localhost:3000/1/2,3,4

    // const originalArray:string =  `${configValue}/${user.data.id}/`;

    const numberString: string = checkedCardList.join(",");

    // Append the number string to the original string
    const resultString: string = `${configValue}/${user.data.userId}/${numberString}`;

    console.log("resultString => ", resultString);

    axios
      .delete(resultString, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response: { data: { token: string } }) => {
        console.log("response add => ", response);
        // setCardList([...cardList, response?.data]);
        axios
          .get(`${configValue}/list-tasks`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          })
          .then((response: any) => {
            setCardList(response?.data);
            setCheckedCardList([]);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const handleSubmit = (values: typeof initialValues, actions: any) => {
    axios
      .post(
        `${configValue}/create-task`,
        {
          name: values.name,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((response: { data: { token: string } }) => {
        console.log("response add => ", response);
        setCardList([...cardList, response?.data]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const handleCheck = (id: number) => {
    if (checkedCardList.includes(id)) {
      setCheckedCardList(checkedCardList.filter((item) => item !== id));
    } else {
      setCheckedCardList([...checkedCardList, id]);
    }
  };

  function handleLogout() {
    setUser({
      data: {},
      isAuthenticated: false,
      token: null,
    });
    navigate("/login");
  }

  useEffect(() => {
    axios
      .get(`${configValue}/list-tasks`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response: any) => {
        setCardList(response?.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <>
      <Box display="flex" justifyContent="flex-end" m={2}>
        <Button variant="contained" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      <Container component="main" maxWidth="sm">
        <Box display="flex" justifyContent="center" sx={{ mt: 8, mb: 4 }}>
          <Typography component="h1" variant="h4">
            Basic Task App
          </Typography>
        </Box>
        <Formik
          initialValues={initialValues}
          validationSchema={AddTaskSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <Form>
              <Box sx={{ my: 2 }}>
                <Field name="email">
                  {({ field }: { field: any }) => (
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="name"
                      label="Task Name"
                      name="name"
                      autoComplete="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={errors.name && touched.name && errors.name}
                    />
                  )}
                </Field>
              </Box>

              <Box sx={{ my: 2 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Add Task
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Container>
      <Box mt={3}>
        <Grid container spacing={2}>
          {cardList?.map((card, index) => {
            return (
              <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                <Box display="flex" justifyContent="center">
                  <Card
                    name={card?.name}
                    onCheck={() => handleCheck(card?.id)}
                  />
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
      {checkedCardList.length > 0 && (
        <Box my={3} display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleDeleteTask}
          >
            Delete
          </Button>
        </Box>
      )}
    </>
  );
};

export default Task;
