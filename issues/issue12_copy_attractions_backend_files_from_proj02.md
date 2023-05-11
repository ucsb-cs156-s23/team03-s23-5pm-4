Bring over backend crud files for Model2 from team02

Throughout this issue, `Model2` is whatever the second model (in addition to `Model2` was in team02.  You may want to search and replace `Model2` with your class name and `model2` with your class name (lowercase) before adding this issue to your project.

# Acceptance Criteria:

- [ ] The `@Entity` class called Attractions.java has been copied from the team02 repo to the team03 repo and committed.
- [ ] The `@Repository` class called `AttractionsRepository.java` has been copied from the team02 repo to the team03 repo and committed.  (Note that the file should be `AttractionsRepository.java`; the team02 instrutions erronously called it `Attractions2.java`; if you called it `Attractions2.java` please update the name now)
- [ ] The `@Repository` class called `AttractionsRepository.java` has been copied from the team02 repo to the team03 repo and committed.  (Note that the file should be `AttractionsRepository.java`; the team02 instrutions erronously called it `Attractions.java`; if you called it `Attractions.java` please update the name now)
- [ ] The controller file `AttractionsController.java` is copied from team02 to team03
- [ ] The controller tests file `AttractionsControllerTests.java` is copied from team02 to team03

- [ ] You can see the `Attractionss` table when you do these steps:
      1. Connect to postgres command line with 
         ```
         dokku postgres:connect team03-qa-db
         ```
      2. Enter `\dt` at the prompt. You should see
         `model2s` listed in the table.
      3. Use `\q` to quit

- [ ] The backend POST,GET,PUT,DELETE endpoints for `Attractions` all work properly in Swagger.

