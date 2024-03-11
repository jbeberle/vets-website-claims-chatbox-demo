/* eslint-disable camelcase */
const mockUser = {
  data: {
    id: '',
    type: 'users_scaffolds',
    attributes: {
      profile: {
        sign_in: {
          service_name: 'idme',
        },
        email: 'vets.gov.user+71@gmail.com',
        loa: { current: 3 },
        first_name: 'Julio',
        middle_name: 'E',
        last_name: 'Hunter',
        gender: 'M',
        birth_date: '1851-11-18',
        verified: true,
      },
      veteran_status: {
        status: 'OK',
        is_veteran: true,
      },
      inProgressForms: [],
      prefillsAvailable: ['10-10EZR'],
      services: [
        'facilities',
        'hca',
        'edu-benefits',
        'evss-claims',
        'user-profile',
        'rx',
        'messaging',
      ],
      va_profile: {
        status: 'OK',
        family_name: 'Hunter',
        gender: 'M',
        given_names: ['Julio', 'E'],
      },
      vet360ContactInformation: {
        email: null,
        residentialAddress: null,
        mailingAddress: {
          addressLine1: '123 elm st',
          addressLine2: null,
          addressLine3: null,
          addressPou: 'CORRESPONDENCE',
          addressType: 'DOMESTIC',
          city: 'Northampton',
          countryName: 'United States',
          countryCodeIso2: 'US',
          countryCodeIso3: 'USA',
          countryCodeFips: null,
          countyCode: '36005',
          countyName: 'Bronx County',
          createdAt: '2020-12-10T20:02:29.000+00:00',
          effectiveEndDate: null,
          effectiveStartDate: '2021-01-20T02:29:58.000+00:00',
          geocodeDate: '2021-01-20T02:31:05.000+00:00',
          geocodePrecision: 31.0,
          id: 208622,
          internationalPostalCode: null,
          latitude: 40.8293,
          longitude: -73.9284,
          province: null,
          sourceDate: '2021-01-20T02:29:58.000+00:00',
          sourceSystemUser: null,
          stateCode: 'MA',
          transactionId: '0edf4400-9de7-442c-ae65-abf192702cef',
          updatedAt: '2021-01-20T02:31:06.000+00:00',
          validationKey: null,
          vet360Id: '1273500',
          zipCode: '01060',
          zipCodeSuffix: '2100',
        },
        mobilePhone: null,
        homePhone: null,
        workPhone: {
          areaCode: '270',
          countryCode: '1',
          createdAt: '2018-04-20T17:22:56.000+00:00',
          extension: null,
          effectiveEndDate: null,
          effectiveStartDate: '2012-10-25T09:03:30.000+00:00',
          id: 2270938,
          isInternational: false,
          isTextable: false,
          isTextPermitted: false,
          isTty: false,
          isVoicemailable: false,
          phoneNumber: '2323232',
          phoneType: 'WORK',
          sourceDate: '2012-10-25T09:03:30.000+00:00',
          sourceSystemUser: null,
          transactionId: 'DATA SEEDING',
          updatedAt: '2018-04-20T17:22:56.000+00:00',
          vet360Id: '1273500',
        },
        temporaryPhone: null,
        faxNumber: null,
        textPermission: null,
        'view:totalDisabilityRating': 90,
      },
    },
  },
  meta: {
    errors: null,
  },
};
/* eslint-enable camelcase */

export default mockUser;
