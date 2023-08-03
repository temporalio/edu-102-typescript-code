# Exercise #5: Version the Change with the `Patching` API

During this exercise, you will 

* Run a Workflow Execution that completes successfully 
* Make and deploy a change that does not affect compatibility
* Make and deploy a change that breaks compatibility, causing a non-deterministic error
* Develop an automated test to check compatibility with previous executions
* Use the `Patching` API to implement versioning for the Workflow

Make your changes to the code in the `practice` subdirectory (look for 
`TODO` comments that will guide you to where you should make changes to 
the code). If you need a hint or want to verify your changes, look at 
the complete version in the `solution` subdirectory.

## Part A: Run a Workflow to Completion

1. Run `npm start` in a terminal to start a Worker
2. Run `npm run workflow a100` in another terminal. This will 
   start a Workflow that processes the loan for customer ID `a100`.
3. Let this Workflow run to completion. This customer has a loan 
   with 10 payments, and since the Workflow in this exercise uses 
   a Timer to add a three-second delay between each payment, it 
   should complete within 30 seconds.
4. You will now download the history of this execution in JSON 
   format so that you can replay it in an automated test that 
   you will develop later in this exercise. Open the Web UI, 
   navigate to the detail page for this execution, and then click 
   the **Download** button that appears on the right side of the 
   page, just above the table showing the Event History.
   Save the file as `history_for_original_execution.json` in your 
   `practice` directory.
   * NOTE: If you are running this exercise in GitPod, you may 
     be unable to download the file, due to the embedded browser
     used in that environment. In this case, run the following 
     command from the `practice`  directory:
     `tctl wf show 
     --workflow_id loan-processing-workflow-customer-a100 
     --print_full > history_for_original_execution.json` 
     to retrieve a copy. 
5. In the next section, you will make and deploy an incompatible 
   change, causing a non-deterministic error for an open execution.
   To allow time for you to do these things, edit the `src/workflows.ts` 
   file and change the duration in the `await Sleep` call from 
   3 seconds to 90 seconds.
6. Save your change to the `src/workflows.ts` file and exit the editor
7. Restart the Worker by pressing Ctrl-C in the terminal window
   from step 1 and running the `npm start` command again
8. Run the Workflow again: `npm run workflow a100`
9. Use the Web UI to verify that the Workflow Execution from the 
   previous step is running before proceeding with the next part
   of this exercise.


## Part B: Deploy an Incompatible Change (without Versioning)

1. This Workflow uses the `sendThankYouToCustomer` Activity to 
   send a thank you message to the customer before charging 
   them with the first loan payment, but this was a mistake.
   This Activity should run after the last payment, so move  
   this call from just before the loop to just after the loop.
2. Save your change and exit the editor.
3. Restart the Worker by pressing Ctrl-C in the terminal 
   window where you started it and then running the 
   `npm start` command again. The change you just 
   made to the Workflow logic takes effect immediately, although
   the Worker immediately begins using the updated code you
   deployed, it may take up to 90 seconds before that is 
   evident for this Workflow Execution, due to the duration of 
   the Timer.
4. Refresh the detail page for this execution in the Web UI. 
   Continue to refresh the page until the non-deterministic
   error is visible.

The non-deterministic error occurs because of your change to the 
Workflow logic. By moving the Activity from before the loop to after
it, the sequence of Commands generated during execution is different 
with the new code than it was prior to the change. 

Recall that you had an open Workflow Execution when you restarted the 
Worker during the deployment. The Worker used History Replay to 
recover the state of the open execution prior to the restart. Since 
the Commands generated when replaying it with the new code did not 
correspond to the Events that were generated when the Worker ran the 
original code before the restart, it is unable to recover the state 
and responds by throwing the non-deterministic error you see.


## Part C: Use the Workflow Replayer to Test Compatibility

1. In the Web UI, navigate to the detail page for the Workflow 
   Execution that completed during Part A of this exercise.
2. Edit the `mocha/workflows.test.ts` file and implement the following
   in the `successfully replays Workflow history from file` function:
   * Read the history file and parse it as JSON
   * Use the `Workflow.runReplayHistory` function, pass it the `WorkflowPath` and the history file.
3. Save your changes
4. Run `npm test`. You should find that this fails, which confirms 
   altering the execution order of the `sendThankYouToCustomer` 
   Activity) breaks compatibility. In the final part of this 
   exercise, you will use the `Patching` API to implement 
   versioning for your change, thereby making it compatible 
   with Workflow Executions started before or after the change.

## Part D: Version the Change with the `Patching` API

Open `src/workflows.ts`. 

At the top of the file, import the Patching API:

```ts
import { patched } from '@temporalio/workflow';
```

Just above the loop, where the `sendThankYouToCustomer` call was prior to 
the change, add the following code:

```ts
  if (!patched('version-2')) {
    await sendThankYouToCustomer(input)
  }
```

This establishes a logical branch for code execution, identified 
by the user-defined Change ID `MovedThankYouAfterLoop`. 

Now wrap the code you previously moved after the loop in a
conditional statement that tests if `patched` is equal to
`MovedThankYouAfterLoop`. This will handle the Activity for Workflow
Executions started after the change.

Now do the following tasks to complete the exercise:

1. Change the duration of the `await sleep` statement at the
   bottom of the loop back to 3 seconds. This is unrelated to
   versioning, but will help you see the results more quickly.
2. Run `npm test` again. You should find it succeeds this time,
   since you've used the `Patching` API to restore compatibility with
   the previous execution.
3. Restart the Worker by pressing `Ctrl-C` in the terminal
   window where you started it and then running the `npm start` command again.
4. Return to the detail page for this Workflow Execution
5. Click the downward-facing arrow to the right of the 
   **Request Cancellation** menu near the upper-right portion of 
   the page and select the **Reset** option.
   * Choose **Reset to last Workflow Task** 
   * Enter "Using versioning to fix a bad deployment" as the reason
   * Click the **Confirm** button
6. Follow the **here** link in the confirmation message shown
    at the top of the screen, which points to the new Workflow 
    Execution created when you reset the Workflow.
70. Enable the auto-refresh feature using the toggle button near
    the top of the page. You should find that the Workflow Execution 
    completes successfully within the next 30 seconds.


### This is the end of the exercise.

