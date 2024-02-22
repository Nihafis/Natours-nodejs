/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const bookTour = async (tourId) => {
  try {
    const stripe = Stripe(
      'pk_test_51O1htGLgDbL3s63Y6ULqNXqxsyNcfk6RbOnNZiPY4iBE8V5wf2JnqIOZ25CJ8bCCWyQATBdUhmxdex45FhNywDzb00abHVIPbS',
    );
    // 1) Get checkout session from API
    const session = await axios(
      `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`,
    );
    console.log(session);
    // 2)Create checkout from + charge credit card
    await stripe.redirectToCheckout({
        sessionId: session.data.session.id
    })
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
