import React from "react";
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
import { useAuthContext } from "../context/authContext";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';


const LogInSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

interface User {
  data?: any; // Adjust the type according to your data structure
  isAuthenticated: boolean;
  token: string | null;
}



const LogInForm: React.FC = () => {
  const { user, setUser } = useAuthContext();
  const navigate = useNavigate();


  const initialValues = {
    email: "",
    password: "",
  };
  const handleSubmit = (values: typeof initialValues, actions: any) => {
    const configValue: string | undefined = process.env.REACT_APP_API_URL;
    console.log("configValue => ", configValue);
    axios
      .post(`${configValue}/login`, {
        email: values.email,
        password: values.password,
      })
      .then((response: { data: { token: string } }) => {
        
        setUser({
          data: response?.data,
          isAuthenticated: true,
          token: response?.data?.token,
        });
        navigate('/tasks');
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography component="h1" variant="h5">
          Log In
        </Typography>
      </Box>
      <Formik
        initialValues={initialValues}
        validationSchema={LogInSchema}
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
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    // error={errors.email && touched.email}
                    helperText={errors.email && touched.email && errors.email}
                  />
                )}
              </Field>
            </Box>
            <Box sx={{ my: 2 }}>
              <Field name="password">
                {({ field }: { field: any }) => (
                  <TextField
                    variant="outlined"
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    // error={errors.password && touched.password}
                    helperText={
                      errors.password && touched.password && errors.password
                    }
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
                // onClick={handleSubmit}
              >
                LogIn
              </Button>
            </Box>
            <Box display="flex" flexDirection="row-reverse">
              <Link id="forgotPassword" to="/">
                <Typography variant="subtitle1">SignUp</Typography>
              </Link>
            </Box>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default LogInForm;
