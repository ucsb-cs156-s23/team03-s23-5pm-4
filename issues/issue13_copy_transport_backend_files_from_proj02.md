Bring over backend crud files for Transport from team02

# Acceptance Criteria:

- [ ] The `@Entity` class called Transport.java has been copied from the team02 repo to the team03 repo and committed.
- [ ] The `@Repository` class called `TransportRepository.java` has been copied from the team02 repo to the team03 repo and committed.  (Note that the file should be `TransportRepository.java`; the team02 instrutions erronously called it `Transport.java`; if you called it `Transport.java` please update the name now)
- [ ] The `@Repository` class called `TransportRepository.java` has been copied from the team02 repo to the team03 repo and committed.  (Note that the file should be `TransportRepository.java`; the team02 instrutions erronously called it `Transport.java`; if you called it `Transport.java` please update the name now)
- [ ] The controller file `TransportController.java` is copied from team02 to team03
- [ ] The controller tests file `TransportControllerTests.java` is copied from team02 to team03

- [ ] You can see the `transports` table when you do these steps:
      1. Connect to postgres command line with 
         ```
         dokku postgres:connect team03-qa-db
         ```
      2. Enter `\dt` at the prompt. You should see
         `transports` listed in the table.
      3. Use `\q` to quit

- [ ] The backend POST,GET,PUT,DELETE endpoints for `Transport` all work properly in Swagger.

