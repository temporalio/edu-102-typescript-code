# Exercise 1: Observing Durable Execution
During this exercise, you will

* Create Workflow and Activity loggers 
* Add logging statements to the code
* Add a Timer to the Workflow Definition
* Launch two Workers and run the Workflow
* Kill one of the Workers during Workflow Execution and observe that the remaining Worker completes the execution

Make your changes to the code in the `practice` subdirectory (look for `TODO` comments that will guide you to where you should make changes to the code). If you need a hint or want to verify your changes, look at the complete version in the `solution` subdirectory.

## Setup

You'll need four terminal windows for this exercise.

1. In all terminals, change to the `exercises/durable-execution/practice` directory.
2. In one terminal, run `npm install` to install dependencies.

## Part A: Add Logging to the Workflow Code

1. Edit the `src/workflows.ts` file
2. Add the `log`  package to the `import { proxyActivities } from '@temporalio/workflow';` line.
3. Add a line at the top of the `sayHelloGoodbyeWorkflow` function to log a message at the Info level
   1. It should mention that the Workflow function has been invoked
   2. It should also include a name-value pair for the name passed as input
3. Before each call to Execute Activity, log a message at Debug level
   1. This should should identify the word being translated
   2. It should also include a name-value pair for the language code passed as input
4. Save your changes

## Part B: Add Logging to the Activity Code

1. Edit the `src/activities.ts` file.
2. Add an import to the top of the file so you can access the logger: `import * as activity from '@temporalio/activity'` package.
3. Define a new `context` variable at the top of the Activity function and assign it `activity.Context.current()` to get access to the logger.
4. Insert a logging statement using `context.log` at the Info level just after this, so you'll know when the Activity is invoked. 
   1. Include the term being translated and the language code as name-value pairs.
4. Optionally, add log statements at the Error level anywhere that the Activity returns an error.
5. Near the bottom of the function, use the Debug level to log the successful translation
	1. Include the translated term as a name-value pair.
6. Save your changes.

## Part C: Add a Timer to the Workflow
You will now add a Timer between the two Activity calls in the Workflow Definition, which will make it easier to observe durable execution in the next section.

1. After the statement where `helloMessage` is defined, but before the statement where `goodbyeInput` is defined, add a new statement that logs the message `Sleeping between translation calls` at the Debug level.
2. Add the `sleep`  function to the `import { proxyActivities } from '@temporalio/workflow';` line.
3. Just after the new log statement, use `await sleep("10 seconds");` to set a Timer for 10 seconds.

## Part D: Observe Durable Execution
It is typical to run Temporal applications using two or more Worker processes. Not only do additional Workers allow the application to scale, it also increases availability since another Worker can take over if a Worker crashes during Workflow Execution. You'll see this for yourself now and will learn more about how Temporal achieves this as you continue through the course.

Before proceeding, make sure that there are no Workers running for this or any previous exercise. Also, please read through all of these instructions before you begin, so that you'll know when and how to react.

1. Open `src/worker.ts`
2. Observe that the logger is customized to print logs at the `DEBUG` level rather than the default `INFO` level.

In each terminal, ensure you are in the `exercises/durable-execution/practice` directory.

1. In one terminal, start the translation microservice by running `npm run service`.
2. In another terminal, start the Worker by running `npm start`
3. In another terminal, start a second Worker by running `npm start`
4. In another terminal, execute the Workflow by running `npm run workflow Tatiana sk` (replace `Tatiana` with your first name) 
5. Observe the output in the terminal windows used by each worker. 
6. 	As soon as you see a log message in one of the Worker terminals indicating that it has started the Timer, press Ctrl-C in that window to kill that Worker process.
7. Switch to the terminal window for the other Worker process. Within a few seconds, you should observe new output, indicating that it has resumed execution of the Workflow.
8. Once you see log output indicating that translation was successful, switch back to the terminal window where you started the Workflow. 

After the final step, you should see the translated Hello and Goodbye messages, which confirms that Workflow Execution completed successfully despite the original Worker being killed.

Since you added logging code to the Workflow and Activity code, take a moment to look at what you see in the terminal windows for each Worker and think about what took place. You may also find it helpful to look at this Workflow Execution in the Web UI.

The microservice for this exercise logs each successful translation, and if you look at its terminal window, you will see that the service only translated Hello (the first Activity) once, even though the Worker was killed after this translation took place. In other words, Temporal did not re-execute the completed Activity when it restored the state of the Workflow Execution. 

### This is the end of the exercise.
