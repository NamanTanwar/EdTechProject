
const BASE_URL=process.env.REACT_APP_BASE_URL

console.log("BASE URL:",BASE_URL);

export const endpoints = {
    SENDOTP_API: `${BASE_URL}/auth/sendotp`,
    SIGNUP_API: `${BASE_URL}/auth/signup`,
    LOGIN_API: `${BASE_URL}/auth/login`,
    RESETPASSTOKEN_API: `${BASE_URL}/auth/reset-password-token`,
    RESETPASSWORD_API: `${BASE_URL}/auth/reset-password`,
  };

export const profileEndpoints={
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
  GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard",
}

  export const settingsEndpoints={
    UPDATE_DISPLAY_PICTURE_API: BASE_URL+"/profile/updateDisplayPicture",
    UPDATE_PROFILE_API:BASE_URL+"/profile/updateProfile",
    CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
    DELETE_PROFILE_API: BASE_URL+"/profile/deleteProfile"
  }

export const courseEndpoints={
  COURSE_CATEGORIES_API: BASE_URL + "/category/showAllCategories",
  CREATE_COURSE_API: BASE_URL + "/course/createCourse",
  EDIT_COURSE_API: BASE_URL + "/course/editCourse",
  UPDATE_SECTION_API: BASE_URL + "/course/updateSection",
  CREATE_SECTION_API: BASE_URL + "/course/addSection",
  DELETE_SECTION_API: BASE_URL + "/course/deleteSection",
  CREATE_SUBSECTION_API: BASE_URL + "/course/addSubSection",
  DELETE_SUBSECTION_API: BASE_URL + "/course/deleteSubSection",
  UPDATE_SUBSECTION_API: BASE_URL + "/course/updateSubSection",
  EDIT_COURSE_API: BASE_URL + "/course/editCourse",
  GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + "/course/getInstructorCourses",
  DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",
  GET_FULL_COURSE_DETAILS_AUTHENTICATED: BASE_URL + "/course/getFullCourseDetails",
  COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetails",
  LECTURE_COMPLETION_API: BASE_URL + "/course/updateCourseProgress",
  CREATE_RATING_API: BASE_URL + "/course/createRating",
  GET_RATING_API: BASE_URL+ "/course/getReviews"
}

export const catalogData={
  CATEGORY_PAGE_DETAILS_API: BASE_URL + "/category/getCategoryPageDetails"
}

export const categories={
  CATEGORIES_API: BASE_URL+"/category/showAllCategories",
}

export const studentEndpoints = {
  COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  COURSE_VERIFY_API: BASE_URL + "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
  GET_PURCHASE_HISTORY: BASE_URL+"/payment/getPurchaseHistory",

}

export const contactusEndpoints = {
  CONTACT_US_API: BASE_URL + "/reach/contact",
}
