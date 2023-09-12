# Exercise 1: Using Objects for Data
During this exercise, you will

* Define TypeScript interfaces to represent input and output of an Activity Definition
* Update the Activity and Workflow code to use these objects
* Run the Workflow to ensure that it works as expected

Make your changes to the code in the `practice` subdirectory (look for `TODO` comments that will guide you to where you should make changes to the code). If you need a hint or want to verify your changes, look at the complete version in the `solution` subdirectory.

## Setup

You'll need three terminal windows for this exercise.

1. In all terminals, change to the `exercises/using-objects/practice` directory.
2. In one terminal, run `npm install` to install dependencies.

## Part A: Define the Activity objects
This exercise provides an improved version of the translation Workflow used in
Temporal 101. The Workflow has already been updated to follow the best practice
of using structs to represent input parameters and return values. You'll apply
what you've learned to do the same for the Activity.

Before continuing with the steps below, take a moment to look at the code in
the `src/shared.ts` file to see how the types are defined for the Workflow.
After this, look at the `src/workflow.ts` file to see how these values are passed
in and used in the Workflow code. Finally, look at the `src/client.ts` to see
how the input parameters are created and passed into the Workflow.

Once you're ready to implement something similar for the Activity, continue with the steps below:

1. Edit the `src/shared.ts` file
2. Define an Interface called `TranslationActivityInput` to use as an input parameter. 
   1. Define a field named `term` of type `string`
   2. Define a field named `languageCode` of type `string`
3. Define an Interface called `TranslationActivityOutput` to use for the result
   1. Define a field named `translation` of type `string`
4. Save your changes


## Part B: Use Objects in Your Activity
Now that you have defined the interfaces, you must update the Activity code to
use them.

1. Edit the `activities.ts` file
2. Replace the two input parameters in the `translateTerm` function with the object you defined as input
3. Replace the output type (string) in the `translateTerm` function with the name of the interface you defined as output
4. At the end of the function, create an object that implements the `TranslationActivityOutput{}` interface  and populate its `translation` field with the `content` variable, which holds the translation returned in the microservice call. 
5. Return the object created in the previous step
6. Save your changes


## Part C: Update the Workflow Code

You've now updated the Activity code to use the structs. The next step is to
update the Workflow code to use these structs where it passes input to the
Activity and access its return value.

1. Edit the `workflows.ts` file
2. Add a new line to define an object that implements `TranslationActivityInput`, populating it with the two fields (term and language code) currently passed as input to the first `translateTerm` call
3. Change the variable type used to access the result the first call to `translateTerm` from `string` to `TranslationActivityOutput`
4. Change that first `translateTerm` call to use the object as its input instead of the two parameters it now uses
5. Update the `helloMessage` string so that it is based on the `Translation` field from the Activity output struct
6. Repeat the previous four steps for the second call to `translateTerm`, which translates "Goodbye" 
7. Save your changes


## Part D: Run the Translation Workflow
Now that you've made the necessary changes, it's time to run the Workflow to
ensure that it works as expected.

1. In one terminal, start the translation microservice by running `npm run service`
2. In another terminal, start the Worker by running `npm start`
3. In another terminal, execute the Workflow by running `npm run workflow Pierre fr` (replace `Pierre` with your first name), which should display customized greeting and farewell messages in French.

If your code didn't work as expected, go back and doublecheck your changes,
possibly comparing them to the code in the `solution` directory.

It's common for a single Workflow Definition to be executed multiple times,
each time using a different input. Feel free to experiment with this by
specifying a different language code when starting the Workflow. The
translation service currently supports the following languages:

* `de`: German
* `es`: Spanish
* `fr`: French
* `lv`: Latvian
* `mi`: Maori
* `sk`: Slovak
* `tr`: Turkish
* `zu`: Zulu

### This is the end of the exercise.
