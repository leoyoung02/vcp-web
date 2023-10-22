import { environment } from '@env/environment';

export const API_BASE = environment.api;

// PLATFORMS
export const COMPANIES_URL = `${API_BASE}/guest/companies-new`;
export const FEATURES_URL = `${API_BASE}/guest/features`;
export const CONFIRM_EMAIL_URL = `${API_BASE}/company/check/confirm-email`;
export const OTHER_SETTINGS_URL = `${API_BASE}/company/other-settings`;
export const DASHBOARD_DETAILS_URL = `${API_BASE}/guest/dashboard/details`;
export const LANGUAGES_URL = `${API_BASE}/languages`;
export const MEMBER_TYPES_URL = `${API_BASE}/guest/custom/member-types`;
export const FEATURE_MAPPING_URL = `${API_BASE}/company/feature/mapping`;
export const FEATURE_SUBFEATURES_URL = `${API_BASE}/guest/feature/all/sub-features`;
export const SUBFEATURES_URL = `${API_BASE}/guest/sub-features`;
export const MEMBERS_ONLY_SETTINGS_URL = `${API_BASE}/guest/subfeature/member-settings`;
export const SUBFEATURES_MAPPING_URL = `${API_BASE}/company/subfeature/mapping`;
export const CONTACT_DETAILS_URL = `${API_BASE}/company/contact-us/details`;
export const MENU_ORDERING_URL = `${API_BASE}/guest/menu-order`;
export const VERSION_URL = `${API_BASE}/company/version`;
export const META_DESCRIPTION_URL = `${API_BASE}/company/meta_description`;
export const COUNTRIES_URL = `${API_BASE}/guest/countries`;
export const MEMBER_PLANS_URL = `${API_BASE}/guest/custom/member/type/pricing-details`;
export const MEMBER_PLANS_LIST_URL = `${API_BASE}/guest/custom/member/type/permissions/list`;
export const STRIPE_PK_URL = `${API_BASE}/guest/stripe/publishable-key`;
export const MEMBER_PLAN_SUBSCRIPTION_URL = `${API_BASE}/company/member-type/subscription`;
export const FEATURE_URL = `${API_BASE}/company/feature`;
export const SUBFEATURE_OPTIONS_URL = `${API_BASE}/company/sub-features/all/options`;
export const SUBFEATURE_URL = `${API_BASE}/company/sub-feature`;
export const FEATURES_MAPPING_URL = `${API_BASE}/guest/features-mapping/combined`;
export const FEATURES_LIST_URL = `${API_BASE}/guest/features-list`;
export const SUBFEATURES_LIST_URL = `${API_BASE}/guest/feature/combined/sub-features`;
export const CREATE_PLAN_ROLES_URL = `${API_BASE}/company/other-settings/create-plan-roles`;
export const CITIES_URL = `${API_BASE}/company/cities`;
export const SUBFEATURE_OPTIONS_MAPPING_URL = `/company/sub-feature/options/mapping`;
export const STRIPE_CUSTOMER_PORTAL_URL = `${API_BASE}/company/customer/portal/create`;
export const EDIT_MEMBER_TYPE_SEQUENCE_URL = `${API_BASE}/profile/fields/edit-sequence`;
export const DELETE_MEMBER_TYPE_URL = `${API_BASE}/company/custom/member/type/delete`;
export const GENERATE_MEMBER_TYPE_LINK_URL = `${API_BASE}/cart/link/generate`;
export const ADD_MEMBER_TYPE_URL = `${API_BASE}/company/custom/member/type/add`;
export const EDIT_MEMBER_TYPE_URL = `${API_BASE}/company/custom/member/type/edit`;
export const SAVE_MEMBER_TYPE_PERMISSIONS_URL = `${API_BASE}/company/custom/member/type/permissions/manage`;
export const ADD_MEMBER_TYPE_FIELD_URL = `${API_BASE}/company/member-type/custom/profile-fields/add`;
export const EDIT_MEMBER_TYPE_FIELD_URL = `${API_BASE}/company/member-type/custom/profile-fields/update`;
export const DELETE_MEMBER_TYPE_FIELD_URL = `${API_BASE}/company/member-type/custom/profile-fields/delete`;
export const MEMBER_TYPE_PROFILE_FIELDS_URL = `${API_BASE}/company/custom/profile/fields`;
export const ADD_CITY_URL = `${API_BASE}/company-admin-city-add`;
export const EDIT_CITY_URL = `${API_BASE}/company-admin-city-edit`;
export const DELETE_CITY_URL = `${API_BASE}/company-admin-city-delete`;
export const EDIT_EMAIL_URL = `${API_BASE}/company/email/edit`;
export const EDIT_MEMBER_EMAIL_URL = `${API_BASE}/company/member-email/edit`;
export const UPLOAD_EMAIL_IMAGE_URL = `${API_BASE}/company/upload-notification-image`;
export const ADD_COMPANY_LOGO_URL = `${API_BASE}/company-admin-branding-upload-logo`;
export const ADD_COMPANY_BANNER_URL = `${API_BASE}/company-admin-branding-upload-banner`;
export const EDIT_COMPANY_LOGO_URL = `${API_BASE}/company/entity/logo/edit`;
export const EDIT_COMPANY_HEADER_IMAGE_URL = `${API_BASE}/company/entity/photo/edit`;
export const EDIT_COMPANY_BANNER_IMAGE_URL = `${API_BASE}/company/entity/video/edit`;
export const EDIT_COMPANY_FAVICON_URL = `${API_BASE}/company/entity/favicon/edit`;


export const LISTS_MANAGEMENT_DATA_URL = `${API_BASE}/v2/lists-management-data`;
export const MANAGE_MEMBER_TYPES_DATA_URL = `${API_BASE}/v2/manage-member-types-data`;
export const MANAGE_SETTINGS_DATA_URL = `${API_BASE}/v2/settings-data`;
export const MANAGE_SETTINGS_EMAIL_DATA_URL = `${API_BASE}/v2/settings-email-data`;

// HOME
export const LANDING_TEMPLATE_URL = `${API_BASE}/guest/landing/template-by-slug`;
export const HOME_TEMPLATE_URL = `${API_BASE}/company/home/template`;
export const MOBILE_LIMIT_SETTINGS_URL = `${API_BASE}/mobile/settings/limit-all`;

export const HOME_DATA_URL = `${API_BASE}/v2/home`;
export const HOME_COURSES_TUTORS_TESTIMONIALS_DATA_URL = `${API_BASE}/v2/home-courses-tutors-testimonials`;

// SETTINGS
export const SETTINGS_CATEGORY_URL = `${API_BASE}/company/settings/category/list/all`;
export const SETTING_CATEGORY_URL = `${API_BASE}/company/settings/category`;
export const OTHER_SETTINGS_CATEGORY_URL = `${API_BASE}/company/settings/categories`;
export const EDIT_EMAIL_SETTINGS_URL = `${API_BASE}/company/email-settings/edit`;
export const MANAGE_COMPANY_FEATURE_URL = `${API_BASE}/company/feature/mapping/edit`;
export const FEATURE_NAME_EDIT_URL = `${API_BASE}/company/feature/edit`;
export const SUBFEATURE_ACTIVATE_URL = `${API_BASE}/company/feature/sub-feature/activate`;
export const SUBFEATURE_DEACTIVATE_URL = `${API_BASE}/company/feature/sub-feature/deactivate`;
export const SETTINGS_OPTIONS_URL = `${API_BASE}/company/other-settings-options-content`;
export const ACTIVATE_OTHER_SETTING_URL = `${API_BASE}/company/other-settings/activate`;
export const DEACTIVATE_OTHER_SETTING_URL = `${API_BASE}/company/other-settings/deactivate`;
export const SAVE_NEW_BUTTON_MENU_URL = `${API_BASE}/company/menu/new/button/edit`;
export const EDIT_MENU_ORDER_URL = `${API_BASE}/company/menu-order/update`;
export const EDIT_PRIVACY_POLICY_URL = `${API_BASE}/company/privacy-policy/edit-url`;
export const EDIT_COOKIE_POLICY_URL = `${API_BASE}/company/cookie-policy/edit-url`;
export const EDIT_TERMS_AND_CONDITIONS_URL = `${API_BASE}/company/terms-conditions/edit-url`;
export const EDIT_TERMS_URL = `${API_BASE}/company/terms-conditions/update`;
export const EDIT_POLICY_URL = `${API_BASE}/company/policy/update`;
export const EDIT_COOKIE_URL = `${API_BASE}/company/cookie-policy/update`;
export const ACTIVATE_POLICY_URL = `${API_BASE}/company/policy/activate`;
export const ACTIVATE_COOKIE_URL = `${API_BASE}/company/cookie-policy/activate`;
export const ACTIVATE_TERMS_URL = `${API_BASE}/company/terms-conditions/activate`;
export const EDIT_OTHER_SETTING_VALUE_URL = `${API_BASE}/company/other-settings/value/update`;

// REPORTS
export const REPORTS_DATA_URL = `${API_BASE}/v2/reports-data`;
export const EDIT_TEAMS_REPORTS_URL = `${API_BASE}/company/reports/teams/graph/settings/edit`;

// AUTH 
export const LOGIN_URL = `${API_BASE}/company/login`;
export const FORGOT_PASSWORD_URL = `${API_BASE}/central/reset-password`;
export const CHANGE_PASSWORD_URL = `${API_BASE}/central/change-password/vistingo`;
export const SIGNUP_FREE_URL = `${API_BASE}/company/user/signup-no-payment/dynamic`;
export const SEND_EMAIL_CONFIRMATION_URL = `${API_BASE}/company/send/confirmation-email`;
export const SELECT_PLAN_EMAIL_URL = `${API_BASE}/company/email/select-plan`;

// PAYMENT
export const VALIDATE_COUPON_URL = `${API_BASE}/company/member-plan/validate-coupon`;
export const CART_USER_SIGNUP_URL = `${API_BASE}/guest/cart/user/signup`;
export const SUBSCRIBE_TRIAL_URL = `${API_BASE}/guest/stripe/pay`;
export const SUBSCRIBE_MEMBER_URL = `${API_BASE}/company/user/custom-member-type/pay`;
export const GUID_IDEMPOTENCY_URL = `${API_BASE}/stripe/update-guid-idempotency`;
export const UPDATE_SUBSCRIPTION_URL = `${API_BASE}/stripe/update-paid`;
export const CART_ASSIGN_COURSES_URL = `${API_BASE}/cart/courses/assign`;

// USER
export const CHECK_EXPIRED_URL = `${API_BASE}/guest/expired/check`;
export const CHECK_MEMBER_TYPES_URL = `${API_BASE}/user/member-types-by-email`;
export const CHECK_OTHER_MEMBER_TYPES_URL = `${API_BASE}/guest/expired/user-member-type`;
export const USER_URL = `${API_BASE}/company/user`;
export const USER_ROLE_URL = `${API_BASE}/company/user/role`;
export const USER_MEMBER_TYPES_URL = `${API_BASE}/user/member-types`;
export const USER_NOTIFICATIONS_URL = `${API_BASE}/company-user-notifications`;
export const USER_ALL_NOTIFICATIONS_URL = `${API_BASE}/company-user-notifications-all`;
export const USER_CHECK_ADMIN_URL = `${API_BASE}/central/isAdminById`;
export const CUSTOM_MEMBER_TYPE_PERMISSIONS_URL = `${API_BASE}/company/custom/member/type/permissions-new`;
export const REGISTRATION_FIELDS_URL = `${API_BASE}/guest/registration-fields`;
export const REGISTRATION_FIELDS_MAPPING_URL = `${API_BASE}/guest/registration-fields-mapping`;
export const EDIT_CUSTOM_MEMBER_TYPE_URL = `${API_BASE}/company/user/custom-member-type/edit`;
export const PROFILE_FIELDS_URL = `${API_BASE}/company/profile-fields`;
export const PROFILE_FIELDS_MAPPING_URL = `${API_BASE}/company/profile-fields-mapping`;
export const USER_GUID_URL = `${API_BASE}/guest/user-guid`;
export const ACTIVE_MEMBERS_URL = `${API_BASE}/company/admin/members`;
export const FOR_CONFIRMATION_MEMBERS_URL = `${API_BASE}/company/members/for-confirm`;
export const DELETED_MEMBERS_URL = `${API_BASE}/company/members/deleted`;
export const NOT_APPROVED_MEMBERS_URL = `${API_BASE}/company/members/not-approved`;
export const INCOMPLETE_MEMBERS_URL = `${API_BASE}/company/members/incomplete`;
export const FOR_APPROVAL_MEMBERS_URL = `${API_BASE}/company/members/for-approval`;
export const SALES_PERSON_LIST_URL = `${API_BASE}/company/guest/sales/person/list`;
export const BULK_DELETE_USERS_URL = `${API_BASE}/company/users/bulk-delete`;
export const BULK_PERMANENT_DELETE_USERS_URL = `${API_BASE}/company/users/bulk-delete-deletedUsers`;
export const BULK_RECOVER_DELETED_USERS_URL = `${API_BASE}/company/users/bulk-recover-deletedUsers`;
export const DELETE_USER_URL = `${API_BASE}/company/vcp-admin/user/delete`;
export const PERMANENT_DELETE_USER_URL = `${API_BASE}/company/vcp-admin/deleted-user/delete`;
export const RECOVER_DELETED_USER_URL = `${API_BASE}/company/vcp-admin/deleted-user/recover`;
export const ADD_USER_URL = `${API_BASE}/company/vcp-admin/user/add`;
export const ADD_DYNAMIC_USER_URL = `${API_BASE}/company/vcp/user/dynamic/custom/add`;
export const EDIT_DYNAMIC_USER_URL = `${API_BASE}/company/user-details/dynamic/custom/update`;
export const UPDATE_USER_STATUS_URL = `${API_BASE}/company/user/status/update`;
export const BULK_UPDATE_USER_STATUS_URL = `${API_BASE}/company/bulk/user/status/update`;
export const UPDATE_CONFIRM_USER_STATUS_URL = `${API_BASE}/company/user/confirm/status/update`;
export const MEMBERS_LIST_URL = `${API_BASE}/company/members/custom-roles/list`;

export const MANAGE_USERS_DATA_URL = `${API_BASE}/v2/manage-users-data`;

// NOTIFICATIONS
export const ACCEPT_CLUB_NOTIFICATION_URL = `${API_BASE}/company-approve-join-group`;
export const ACCEPT_PLAN_NOTIFICATION_URL = `${API_BASE}/company-approve-join-plan`;
export const ACCEPT_CLUB_PLAN_NOTIFICATION_URL = `${API_BASE}/company-approve-join-group-plan`;
export const ACCEPT_PLAN_REQUEST_NOTIFICATION_URL = `${API_BASE}/company-approve-join-plan-request`;
export const DELETE_NOTIFICATION_URL = `${API_BASE}/company/notification/delete`;
export const READ_NOTIFICATION_URL = `${API_BASE}/company-read-notification`;
export const DECLINE_NOTIFICATION_URL = `${API_BASE}/company-decline-notification`;
export const APPROVE_WAITING_LIST_URL = `${API_BASE}/company/waiting-list/approve`;
export const REJECT_WAITING_LIST_URL = `${API_BASE}/company/waiting-list/reject`;
export const ACCEPT_CLUB_REQUEST_URL = `${API_BASE}/company-approve-join-group-request`;
export const COMMENT_DETAILS_URL = `${API_BASE}/company/comment/details`;
export const APPROVE_CLUB_ACTIVITY_URL = `${API_BASE}/company/club-activity/approve`;
export const APPROVE_BLOG_URL = `${API_BASE}/company/blog/approve`;
export const REJECT_BLOG_URL = `${API_BASE}/company/reject/blog`;
export const BLOG_REQUEST_DETAILS_URL = `${API_BASE}/company/blog/request`;

// IMAGES
export const COMPANY_IMAGE_URL = `${API_BASE}/get-image-company`;
export const COURSE_UNIT_IMAGE_URL = `${API_BASE}/get-course-unit-file`;
export const COURSE_IMAGE_URL = `${API_BASE}/get-course-image`;

/**
 * FEATURES
 */

// PLANS
export const PLAN_CATEGORIES_URL = `${API_BASE}/company/event/supercategories/list`;
export const PLAN_CATEGORY_ADD_URL = `${API_BASE}/company/plan-event/category/add`;
export const PLAN_CATEGORY_EDIT_URL = `${API_BASE}/company/plan-event/category/edit`;
export const PLAN_CATEGORY_DELETE_URL = `${API_BASE}/company/plan-event/category/delete`;
export const PLAN_SUBCATEGORIES_URL = `${API_BASE}/company/plan/subcategories-list`;
export const PLAN_SUBCATEGORIES_ADD_URL = `${API_BASE}/company/plan/subcategory/add`;
export const PLAN_SUBCATEGORIES_EDIT_URL = `${API_BASE}/company/plan/subcategory/edit`;
export const PLAN_SUBCATEGORY_DELETE_URL = `${API_BASE}/company/plan/subcategory/delete`;
export const EVENT_CATEGORIES_URL = `${API_BASE}/guest/event/categories/list`;
export const EVENT_SUBCATEGORIES_URL = `${API_BASE}/guest/event/subcategories/list`;
export const EVENT_CUSTOM_SUBCATEGORIES_URL = `${API_BASE}/guest/event/custom/subcategories/list`;
export const PLAN_SUPERCATEGORIES_URL = `${API_BASE}/guest/company/plan/super_categories`;
export const PLAN_SUBCATEGORIES_MAPPING_URL = `${API_BASE}/guest/company/plan/subcategories-mapping-all`;
export const EVENT_TYPES_URL = `${API_BASE}/guest/event/types`;
export const PAST_PLANS_URL = `${API_BASE}/company/all-past-plans`;
export const PLANS_LIST_URL = `${API_BASE}/guest/all-plans-list`;
export const EVENT_SETTINGS_URL = `${API_BASE}/company/event/settings`;
export const PLANS_CALENDAR_URL = `${API_BASE}/company/calendar`;
export const PLAN_EMAIL_TO_URL = `${API_BASE}/company/share-email-template`;
export const PLAN_INVITE_LINK_URL = `${API_BASE}/company/event/invite/link`;
export const PLAN_UPDATE_SLUG_URL = `${API_BASE}/company/event/update-slug`;
export const PLAN_UPDATE_ALIAS_URL = `${API_BASE}/company/user/update-alias`;
export const JOIN_REQUEST_URL = `${API_BASE}/company/join_request`;
export const JOIN_PLAN_URL = `${API_BASE}/company/plan/participant/add`;
export const JOIN_GROUP_PLAN_URL = `${API_BASE}/company/group_plan/participant/add`;
export const LEAVE_GROUP_PLAN_URL = `${API_BASE}/company/group_plan/participant/remove`;
export const LEAVE_PLAN_URL = `${API_BASE}/company/plan/participant/remove`;
export const ADD_TO_WAITING_LIST_URL = `${API_BASE}/company/plan/waiting-list/add`;
export const REMOVE_FROM_WAITING_LIST_URL = `${API_BASE}/company/plan/waiting-list/remove`;
export const ADD_PLAN_COMMENT_URL = `${API_BASE}/company/plan/comment/add`;
export const ADD_GROUP_PLAN_COMMENT_URL = `${API_BASE}/company/group_plans/comment/add`;
export const DELETE_GROUP_PLAN_COMMENT_REACTION_URL = `${API_BASE}/company/delete-group-plan-comment-heart-new`;
export const ADD_GROUP_PLAN_COMMENT_REACTION_URL = `${API_BASE}/company/heart-group-plan-comment-new`;
export const ADD_GROUP_PLAN_COMMENT_REPLY_URL = `${API_BASE}/company/add-group-plan-comment-reply-new`;
export const GROUP_PLAN_COMMENTS_URL = `${API_BASE}/company/group-plan/comments`;
export const DELETE_COMMENT_URL = `${API_BASE}/company/activities/comment/delete`;
export const ANSWER_EMAIL_INVITE_QUESTIONS_URL = `${API_BASE}/company/email-invite/question/answer`;
export const CLUB_PLAN_DELETE_URL = `${API_BASE}/company/group_plans/delete`;
export const DELETE_RECURRING_SERIES_URL = `${API_BASE}/company/activities/recurring/series/delete`;
export const CONFIRM_PLAN_PARTICIPANT_ATTENDANCE_URL = `${API_BASE}/company/company-plan/confirm/attendance`;
export const CLEAR_PLAN_PARTICIPANT_ATTENDANCE_URL = `${API_BASE}/company/company-plan/clear/attendance`;
export const CONFIRM_PARTICIPANT_ATTENDANCE_URL = `${API_BASE}/company/plan/confirm/attendance`;
export const CLEAR_PARTICIPANT_ATTENDANCE_URL = `${API_BASE}/company/plan/clear/attendance`;
export const CONFIRM_PARTICIPANT_URL = `${API_BASE}/company/plan/attendance/confirm`;
export const CLEAR_CONFIRMATION_URL = `${API_BASE}/company/plan/clear/confirm`;
export const CONFIRM_PLAN_PARTICIPANT_URL = `${API_BASE}/company/company-plan/attendance/confirm`;
export const CLEAR_PLAN_CONFIRMATION_URL = `${API_BASE}/company/company-plan/clear/confirm`;
export const CREATE_CLUB_PLAN_URL = `${API_BASE}/company/group_plans/create-optimize`
export const CREATE_PLAN_URL = `${API_BASE}/company/plans/create-optimize`;
export const CREATE_PLAN_FOR_APPROVAL_URL = `${API_BASE}/company/club-activities/approval/notification`;
export const ACTIVITY_CITIES_URL = `${API_BASE}/company/activity/cities`;
export const EDIT_CLUB_PLAN_URL = `${API_BASE}/company/group_plans/edit-new`;
export const EDIT_PLAN_URL = `${API_BASE}/company/plans/edit-new`;

export const PLANS_URL = `${API_BASE}/v2/plans`;
export const PLANS_OTHER_DATA_URL = `${API_BASE}/v2/plans-other-data`;
export const PLAN_DETAILS_URL = `${API_BASE}/v2/plan-details`;
export const PLANS_MANAGEMENT_DATA_URL = `${API_BASE}/v2/plans-management-data`;

// CLUBS
export const SUBGROUP_TITLE_URL = `${API_BASE}/company/subgroup/titles`;
export const GROUP_CATEGORIES_URL = `${API_BASE}/company/group/categories/list`;
export const GROUP_CATEGORY_ADD_URL = `${API_BASE}/company/group/category/add`;
export const GROUP_CATEGORY_EDIT_URL = `${API_BASE}/company/group/category/edit`;
export const GROUP_CATEGORY_DELETE_URL = `${API_BASE}/company/group/category/delete`;
export const GROUP_SUBCATEGORIES_URL = `${API_BASE}/company/group/subcategories/list`;
export const GROUP_SUBCATEGORY_ADD_URL = `${API_BASE}/company/group/subcategory/add`;
export const GROUP_SUBCATEGORY_EDIT_URL = `${API_BASE}/company/group/subcategory/edit`;
export const GROUP_SUBCATEGORY_DELETE_URL = `${API_BASE}/company/group/subcategory/delete`;
export const CONTACT_FIELDS_URL = `${API_BASE}/guest/contact/fields`;
export const CONTACT_FIELDS_ADD_URL = `${API_BASE}/company/contact/field/add`;
export const CONTACT_FIELDS_EDIT_URL = `${API_BASE}/company/contact/field/edit`;
export const LEAVE_CLUB_URL = `${API_BASE}/company/group/member/remove`;
export const DELETE_CLUB_COMMENT_URL = `${API_BASE}/company/group/comment/delete`;
export const CLUB_COMMENTS_URL = `${API_BASE}/company/group/comments`;
export const ADD_COMMENT_REACTION_URL = `${API_BASE}/heart-group-comment-new`;
export const REMOVE_COMMENT_REACTION_URL = `${API_BASE}/delete-group-comment-heart-new`;
export const ADD_CLUB_COMMENT_URL = `${API_BASE}/company/group/comment/add`;
export const ADD_COMMENT_REPLY_URL = `${API_BASE}/add-group-comment-reply-new`;
export const DELETE_CLUB_URL = `${API_BASE}/company/group/delete`;
export const REQUEST_JOIN_URL = `${API_BASE}/company/group/join_request`;
export const JOIN_CLUB_URL = `${API_BASE}/company/group/member/add`;
export const CLUB_PLANS_URL = `${API_BASE}/company/groups-plans`;
export const ADD_CLUB_URL = `${API_BASE}/company/group-optimize`;
export const EDIT_CLUB_URL = `${API_BASE}/company/groups/edit-admin`;
export const CLUB_MEMBERS_URL = `${API_BASE}/company/club/all-members`;

export const CLUBS_URL = `${API_BASE}/v2/clubs`;
export const CLUBS_DATA_URL = `${API_BASE}/v2/clubs-other-data`;
export const CLUB_URL = `${API_BASE}/v2/club-details`;

// JOB OFFERS
export const JOB_OFFERS_URL = `${API_BASE}/v2/job-offers`;
export const JOB_OFFERS_DATA_URL = `${API_BASE}/v2/job-offers-other-data`;
export const JOB_OFFER_URL = `${API_BASE}/v2/job-offer-details`;
export const JOB_OFFER_MIN_URL = `${API_BASE}/v2/job-offer-details-min`;
export const DELETE_JOB_OFFER_URL = `${API_BASE}/company/job/offer/delete`;
export const REGISTER_JOB_OFFER_URL = `${API_BASE}/company/job/register/create`;
export const CREATE_JOB_OFFER_URL = `${API_BASE}/company/job/offer/create-new`;
export const EDIT_JOB_OFFER_URL = `${API_BASE}/company/job/offer/edit-new`;

// CITY GUIDES
export const CITY_GUIDES_URL = `${API_BASE}/v2/city-guides`;
export const CITY_GUIDE_URL = `${API_BASE}/v2/city-guide`;
export const ADD_CITY_GUIDE_URL = `${API_BASE}/v2/city-guide/add`;
export const EDIT_CITY_GUIDE_GENERAL_URL = `${API_BASE}/v2/city-guide/edit`;
export const EDIT_CITY_GUIDE_LIKE_URL = `${API_BASE}/v2/city-guide/like/edit`;
export const EDIT_CITY_GUIDE_URL = `${API_BASE}/company-admin-news-delete`;
export const ADD_CITY_GUIDE_ITEM_URL = `${API_BASE}/v2/city-guide-item/add`;
export const EDIT_CITY_GUIDE_ITEM_URL = `${API_BASE}/v2/city-guide-item/edit`;
export const DELETE_CITY_GUIDE_ITEM_URL = `${API_BASE}/v2/city-guide-item/delete`;

// COURSES
export const COURSE_SUBSCRIPTIONS_URL = `${API_BASE}/course-subscriptions`;
export const COURSE_TUTORS_URL = `${API_BASE}/course-tutors`;
export const COURSE_EXCEPION_USERS_URL = `${API_BASE}/course/exception/users`;
export const COURSES_URL = `${API_BASE}/company/courses`;
export const COURSE_CATEGORY_ADD_URL = `${API_BASE}/company/course/category/add`;
export const COURSE_CATEGORY_EDIT_URL = `${API_BASE}/company/course/category/edit`;
export const COURSE_CATEGORY_DELETE_URL = `${API_BASE}/company/course/category/delete`;
export const COURSE_CATEGORY_ACCESS_ROLES_URL = `${API_BASE}/company/course/category/access/roles`;
export const COURSE_CATEGORY_ACCESS_EDIT_URL = `${API_BASE}/company/course/category/access/edit`;
export const COURSE_CATEGORY_MAPPING_URL = `${API_BASE}/guest/course/category-mapping`;
export const COURSE_CATEGORIES_URL = `${API_BASE}/guest/course/categories`;
export const COURSE_CATEGORY_ACCESS_URL = `${API_BASE}/company/course/category/access/all`;
export const USER_COURSES_URL = `${API_BASE}/guest/courses`;
export const VIMEO_EMBED_URL = `${API_BASE}/course/vimeo/video`;

export const COURSES_COMBINED_URL = `${API_BASE}/v2/courses`;
export const COURSE_DETAILS_URL = `${API_BASE}/v2/course-details`;
export const COURSE_UNIT_DETAILS_URL = `${API_BASE}/v2/course-unit-details`;

// TUTORS
export const TUTORS_URL = `${API_BASE}/company/tutors`;
export const CREDIT_PACKAGES_URL = `${API_BASE}/company/credit/packages`;

export const TUTORS_COMBINED_URL = `${API_BASE}/v2/tutors`;
export const TUTOR_DETAILS_URL = `${API_BASE}/v2/tutor-details`;

// TESTIMONIALS
export const TESTIMONIALS_URL = `${API_BASE}/v2/testimonials`;
export const TESTIMONIAL_DETAILS_URL = `${API_BASE}/v2/testimonial-details`;