// El siguiente codigo permite crear un usuario sin address

import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Box,
  Container,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import pintpalLogo from '../assets/pintpal-logo.png';

const fieldsValidation = Yup.object({
  first_name: Yup.string().required('El nombre es requerido.'),
  last_name: Yup.string().required('El apellido es requerido.'),
  email: Yup.string().email('Email no válido.').required('El email es requerido.'),
  handle: Yup.string().required('El nombre de usuario es requerido.').min(3, 'El nombre de usuario debe tener al menos 3 caracteres.'),
  password: Yup.string().required('La contraseña es requerida').min(6, 'La contraseña debe tener al menos 6 caracteres.'),
});

const initialValues = {
  first_name: '',
  last_name: '',
  email: '',
  handle: '',
  password: '',
  // line1: '',
  // line2: '',
  // city: '',
};

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    axios.post('http://localhost:3001/api/v1/signup', { user: values })
      .then((response) => {
        const JWT_TOKEN = response.headers['authorization'];
        console.log('User registered successfully:', response.data);
  
        if (JWT_TOKEN) {
          localStorage.setItem('JWT_TOKEN', JWT_TOKEN);
          console.log(JWT_TOKEN);
        }
        
        navigate('/login');
      })
      .catch((error) => {
        console.error('Error during signup:', error);
      });
  };
  

  return (
    <Container maxWidth="xs">
      <Box mt={5}>
        <Typography variant="h4" align='left' gutterBottom sx={{color: 'black', fontWeight:500 }}>
          Sign Up
        </Typography>

        <div style={{ display: 'flex', flexDirection:'column', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '20px', marginBottom:'20px' }}>
          <img src={pintpalLogo} alt="PintPal Logo" style={{ width: '100px', height: '100px' }} />
          <h2 style={{ margin: 0, color: 'black', fontSize: '2.2rem', fontWeight: 500 }}>PintPal</h2>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={fieldsValidation}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Field
                as={TextField}
                name="first_name"
                label="First name"
                fullWidth
                margin="normal"
                error={touched.first_name && Boolean(errors.first_name)}
                helperText={touched.first_name && errors.first_name}
                sx={{
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  borderRadius: '5px',
                }}
              />
              <Field
                as={TextField}
                name="last_name"
                label="Last name"
                fullWidth
                margin="normal"
                error={touched.last_name && Boolean(errors.last_name)}
                helperText={touched.last_name && errors.last_name}
                sx={{
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  borderRadius: '5px',
                }}
              />
              <Field
                as={TextField}
                name="email"
                label="Email"
                fullWidth
                margin="normal"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  borderRadius: '5px',
                }}
              />
              <Field
                as={TextField}
                name="handle"
                label="Handle"
                fullWidth
                margin="normal"
                error={touched.handle && Boolean(errors.handle)}
                helperText={touched.handle && errors.handle}
                sx={{
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  borderRadius: '5px',
                }}
              />
              <Field
                as={TextField}
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  borderRadius: '5px',
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {/* <Typography variant="subtitle1" align="left" gutterBottom sx={{color: 'grey', marginTop:5 }}>
                Optional Adress Details
              </Typography> */}
              {/* <Field
                as={TextField}
                name="line1"
                label="Line 1"
                fullWidth
                margin="normal"
                sx={{
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  borderRadius: '5px',
                }}
              /> */}
              {/* <Field
                as={TextField}
                name="line2"
                label="Line 2"
                fullWidth
                margin="normal"
                sx={{
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  borderRadius: '5px',
                }}
              /> */}
              {/* <Field
                as={TextField}
                name="city"
                label="City"
                fullWidth
                margin="normal"
                sx={{
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  borderRadius: '5px',
                }}
              /> */}
              <Box mt={2} sx={{marginTop:5}}>
                <Button
                  type="submit"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{
                    background: 'linear-gradient(to right, #FFDB01, #FF8603)',
                    color: 'white',
                    padding: '10px',
                  }}
                >
                  Sign Up
                </Button>
              </Box>
              <Box mt={2} textAlign="center">
                <Typography variant="body2" sx={{color: 'grey'}}>
                  Already have an account?{' '}
                  <Button color="primary" href="/login" sx={{color:'black', fontSize:14}}>
                    Sign In
                  </Button>
                </Typography>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}



// El siguiente codigo permite crear un usuario con address, pero salta el rollback de city_id
// import React from 'react';
// import { Formik, Form, Field } from 'formik';
// import * as Yup from 'yup';
// import { TextField, Button, Box, Container, Typography } from '@mui/material';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const fieldsValidation = Yup.object({
//   first_name: Yup.string().required('El nombre es requerido.'),
//   last_name: Yup.string().required('El apellido es requerido.'),
//   email: Yup.string().email('Email no válido.').required('El email es requerido.'),
//   handle: Yup.string().required('El handle es requerido.').min(3, 'El handle debe tener al menos 3 caracteres.'),
//   password: Yup.string().required('La contraseña es requerida').min(6, 'La contraseña debe tener al menos 6 caracteres.'),
//   line1: Yup.string(),
//   line2: Yup.string(),
//   line2: Yup.string(),
// });

// const initialValues = {
//   first_name: '',
//   last_name: '',
//   email: '',
//   handle: '',
//   password: '',
//   address_attributes: {
//     line1: '',
//     line2: '',
//     line2: ''
//   }
// };

// export default function Signup() {
//   const navigate = useNavigate();

//   const handleSubmit = (values, actions) => {
//     const userData = {
//       user: {
//         first_name: values.first_name,
//         last_name: values.last_name,
//         email: values.email,
//         handle: values.handle,
//         password: values.password,
//         address_attributes: {
//           line1: values.address_attributes.line1,
//           line2: values.address_attributes.line2,
//           line2: values.address_attributes.line2
//         }
//       }
//     };

//     axios.post('http://localhost:3001/api/v1/users', userData)
//       .then(response => {
//         console.log('User registered successfully:', response.data);
//         navigate('/'); // Redirige al inicio o a otro lugar después del registro
//       })
//       .catch(error => {
//         console.error('Error registering user:', error);
//         actions.setSubmitting(false);
//       });
//   };

//   return (
//     <Container maxWidth="xs">
//       <Box mt={5}>
//         <Typography variant="h4" align="center" gutterBottom>
//           Registrarse
//         </Typography>
//         <Formik
//           initialValues={initialValues}
//           validationSchema={fieldsValidation}
//           onSubmit={handleSubmit}
//         >
//           {({ errors, touched, isSubmitting }) => (
//             <Form>
//               <Field
//                 as={TextField}
//                 name="first_name"
//                 label="Nombre"
//                 fullWidth
//                 margin="normal"
//                 error={touched.first_name && Boolean(errors.first_name)}
//                 helperText={touched.first_name && errors.first_name}
//               />
//               <Field
//                 as={TextField}
//                 name="last_name"
//                 label="Apellido"
//                 fullWidth
//                 margin="normal"
//                 error={touched.last_name && Boolean(errors.last_name)}
//                 helperText={touched.last_name && errors.last_name}
//               />
//               <Field
//                 as={TextField}
//                 name="email"
//                 label="Email"
//                 fullWidth
//                 margin="normal"
//                 error={touched.email && Boolean(errors.email)}
//                 helperText={touched.email && errors.email}
//               />
//               <Field
//                 as={TextField}
//                 name="handle"
//                 label="Handle"
//                 fullWidth
//                 margin="normal"
//                 error={touched.handle && Boolean(errors.handle)}
//                 helperText={touched.handle && errors.handle}
//               />
//               <Field
//                 as={TextField}
//                 name="password"
//                 label="Contraseña"
//                 type="password"
//                 fullWidth
//                 margin="normal"
//                 error={touched.password && Boolean(errors.password)}
//                 helperText={touched.password && errors.password}
//               />
//               <Typography variant="h6" align="left" gutterBottom>
//                 Dirección (opcional)
//               </Typography>
//               <Field
//                 as={TextField}
//                 name="address_attributes.line1"
//                 label="Línea 1"
//                 fullWidth
//                 margin="normal"
//               />
//               <Field
//                 as={TextField}
//                 name="address_attributes.line2"
//                 label="Línea 2"
//                 fullWidth
//                 margin="normal"
//               />
//               <Field
//                 as={TextField}
//                 name="address_attributes.line2"
//                 label="Ciudad"
//                 fullWidth
//                 margin="normal"
//               />
//               <Box mt={2}>
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   color="primary"
//                   fullWidth
//                   disabled={isSubmitting}
//                 >
//                   Registrarse
//                 </Button>
//               </Box>
//             </Form>
//           )}
//         </Formik>
//       </Box>
//     </Container>
//   );
// }
