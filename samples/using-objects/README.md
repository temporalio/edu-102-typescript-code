# Optional: Using Objects for Data

In this example, you will see how objects are used to represent input and output data of Workflow and Activity Definitions.


## Part A: Observing the Defined Objects in Workflows
This sample provides an improved version of the translation Workflow used in Temporal 101. The Workflow follows the best practice of using objects to represent input parameters and return values. 

Look at the code in the `shared.ts` file to see how the objects are defined for the Workflows and Activities. After this, look at the `src/workflows.ts` file to see how these values are passed in and used in the Workflow code. Finally, look at `client.ts` to see how the input parameters are created and passed into the Workflow.


## Part B: Observing the Defined Objects in Activities
Now let's take a look at how we used objects to represent input and output data in Activity definitions. 

Take a look at the `activities.ts` file to see how the `translateTerm` function takes in the `TranslationActivityInput` object as an input parameter. Also notice how that function returns a `TranslationActivityOutput` object for the output.


## Part C: Run the Translation Workflow
To run the Workflow:

1. In one terminal, start the translation microservice by running `npm run service`
2. In another terminal, start the Worker by running `npm start`
3. In another terminal, execute the Workflow by running `npm run workflow Pierre fr` (replace `Pierre` with your first name), which should display customized greeting and farewell messages in French.

It's common for a single Workflow Definition to be executed multiple times, each time using a different input. Feel free to experiment with this by specifying a different language code when starting the Workflow. The translation service currently supports the following languages:

* `de`: German
* `es`: Spanish
* `fr`: French
* `lv`: Latvian
* `mi`: Maori
* `sk`: Slovak
* `tr`: Turkish
* `zu`: Zulu



### This is the end of the sample.

