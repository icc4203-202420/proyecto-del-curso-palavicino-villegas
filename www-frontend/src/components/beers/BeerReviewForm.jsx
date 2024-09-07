import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

const reviewValidation = Yup.object({
  rating: Yup.number()
    .required("Rating is required to submit your review")
    .min(1, "Please provide a rating between 1 and 5")
    .max(5, "Please provide a rating between 1 and 5"),
  text: Yup.string()
    .required("Please add a review to share your thoughts")
    .min(15, "Your review must be at least 15 characters long")
    .max(255, "Your review cannot exceed 255 characters"),
});

const initialValues = {
  text: '',
  rating: '',
};

const BeerReviewForm = ({ beer, open, onClose, onSubmit }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{beer.name} Review</DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={reviewValidation}
        onSubmit={(values) => {
          onSubmit(values);
          onClose();
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <DialogContent>
              <Field
                as={TextField}
                fullWidth
                id="text"
                name="text"
                label="Review"
                type="text"
                error={touched.text && Boolean(errors.text)}
                helperText={touched.text && errors.text}
              />
              <Field
                as={TextField}
                fullWidth
                id="rating"
                name="rating"
                label="Rating"
                type="number"
                error={touched.rating && Boolean(errors.rating)}
                helperText={touched.rating && errors.rating}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary" disabled={isSubmitting}>
                Submit
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default BeerReviewForm;
