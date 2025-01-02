# Exercise 2: Testing the Translation Workflow
During this exercise, you will

* Run a unit test provided for the `translateTerm` Activity
* Develop and run your own unit test for the `translateTerm` Activity
* Write assertions for a Workflow test 
* Uncover, diagnose, and fix a bug in the Workflow Definition
* Observe the time-skipping feature in the Workflow test environment

Make your changes to the code in the `practice` subdirectory (look for 
`TODO` comments that will guide you to where you should make changes to 
the code). If you need a hint or want to verify your changes, look at 
the complete version in the `solution` subdirectory.

## Setup

You'll need two terminal windows for this exercise.

1. In all terminals, change to the `exercises/testing-code/practice` directory.
2. In one terminal, run `npm install` to install dependencies.

## Part A: Running a Test

We have provided a unit test for the `translateTerm` Activity
to get you started. This test verifies that the Activity correctly 
translates the term "Hello" to German. Take a moment to study the 
test, which you'll find in the `src/mocha/activities.test.ts` file. Since the 
test runs the Activity, which in turn calls the microservice to do 
the translation, you'll begin by starting that.

1. In one terminal, run `npm run service` 
2. In another terminal, run the `npm test` command to execute the provided test

## Part B: Write and Run Another Test for the Activity

Now it's time to develop and run your own unit test, this time 
verifying that the Activity correctly supports the translation 
of a different word in a different language.

1. Edit the `src/mocha/activities.test.ts` file
2. Copy the `successfully translates "Hello" to German` test, 
   renaming the new test as `successfully translates "Goodbye" to Latvian`
3. Change the term for the input from `Hello` to `Goodbye` 
4. Change the language code for the input from `de` (German) to `lv` (Latvian)
5. Assert that translation returned by the Activity is `Ardievu` 

## Part C: Test the Activity with Invalid Input

In addition to verifying that your code behaves correctly when used as 
you intended, it is sometimes also helpful to verify its behavior with 
unexpected input. The following example does this, testing that the Activity 
returns the appropriate error when called with an invalid language code. 

```ts
  it('fails to translate with bad language code', async () => {
    const env = new MockActivityEnvironment();
    const input = {
      term:         "Hello",
      languageCode: "xq",
    };
    try {
      await env.run(activities.translateTerm, input);
      assert.fail('Expected error was not thrown');
    } catch (err: any) {
      console.log(err.message)
      assert(err.message.includes("HTTP Error 400: Unknown language code \"xq\""));
    }
  });
```

Take a moment to study this code, and then continue with the following steps:

1. Edit the `src/mocha/activites.test.ts` file
3. Copy the entire `"fails to translate with bad language code"` function
   provided above and paste it at the bottom of the `src/mocha/activities.test.ts` file 
4. Save the changes
5. Run `npm test` again to run this new test, in addition to the others

## Part D: Test a Workflow Definition

1. Edit the `src/mocha/workflows.test.ts` file
2. Remove the first and last line of the file to uncomment the test.
4. Add assertions for the following conditions
   * The `helloMessage` field in the result is `Bonjour, Pierre`
   * The `goodbyeMessage` field in the result is `Au revoir, Pierre`
5. Save your changes
6. Run `npm test`. This will fail, due to a bug in the Workflow Definition.
7. Find and fix the bug in the Workflow Definition
8. Run the `npm test` command again to verify that you fixed the bug

There are two things to note about this test.

First, the test completes in under a second, even though the Workflow 
Definition contains a `sleep` call that adds a 10-second delay 
to the Workflow Execution. This is because of the time-skipping feature
provided by the test environment.

Second, the test defines a Worker that registers your Activities, meaning 
that the Activity Definitions are executed as part of this Workflow 
test. As you learned, you can test your Workflow Definition in isolation 
from the Activity implementations by using mocks. The optional exercise 
that follows provides an opportunity to try this for yourself.

### This is the end of the exercise.

## (Optional) Using Mock Activities in a Workflow Test

If you have time and would like an additional challenge, 
continue with the following steps.

1. Make a copy of the existing Workflow Test by running 
   `cp src/mocha/workflows.test.ts src/mocha/workflows-mocks.test.ts`
2. Edit the `src/mocha/workflows-mocks.test.ts` file
3. Add an import for `sinon` with `import sinon from 'sinon';` 
4. Add an import for the Translation Activity input and output
   `import { TranslationActivityInput, TranslationActivityOutput } from '../shared';`
5. Rename the test function to `it('successfully completes French translation with a mocked call', async () => {`
6. Make the following changes between where the object representing
   workflow input is defined and where the Worker is defined:
   * Create and populate an instance of the `TranslationActivityInput`
     object to represent input passed to the Activity when translating 
     the greeting. Name it `helloInput`.
   * Create and populate an instance of the `TranslationActivityOutput`
     object to represent output returned by the Activity when translating 
     the greeting. Name it `helloOutput`.
   * Repeat the above two steps, this time creating objects for the goodbye message.
     Switch the names from `hello` to `goodbye`.
   * Use Sinon to create a mock that represents the `TranslateTerm` Activity, 
     which will return the output object you created when called 
     with the input object you created:  `const translateTermMock = sinon.stub();`
   * Add the following two lines to return mock results for the translations:
       `translateTermMock.withArgs(helloInput).resolves(helloOutput);`
       `translateTermMock.withArgs(goodbyeInput).resolves(goodbyeOutput);`
7. For the Worker, modify the registered Activities so it uses your mock:
       `activities: { translateTerm: translateTermMock },`
8. Save your changes
9. Run `npm test` to run the tests
