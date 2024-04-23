# co-working-space-management

This base code is an experiment. We combine automation with GPT-4's API to automate the coding. The result:

1. Relational database schema design.
2. UI code in react prior to integration with backend web service.
3. RESTful backend web service using FastAPI.
4. Finally, an integration for 2 & 3 above.

The whole process of auto code generations took roughly 2 hours for all of the above, considering the fact that this is a simple application. However, there were still minor errors here and there which manual fixes were deemed quicker. So, the total process took roughly 3 days worth of effort.

Outstanding work (which may or may not be completed in this experiment):

1. User type checking so that only admin gets to see certain screens and uses certain features such as editing an existing booking.
2. Final Stripe integration for CC payment.
3. Open up browsing of space for guest users (login not required).
4. Some cleanups.
5. For production: use hooks. refine AuthContext, secure cookies use. APIs may also need improvement in terms of security.

Take note this is just an experiment to test our coding automation process. The idea is to be able to build an MVP demo with just a single prompt from user.
