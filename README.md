# Code Repository for Temporal 102 (TypeScript)
This repository provides code used for exercises and demonstrations included in
the TypeScript version of the [Temporal
102](https://learn.temporal.io/courses/temporal_102) training course.

It's important to remember that the example code used in this course was designed to support learning a specific aspect of Temporal, not to serve as a ready-to-use template for implementing a production system.

For the exercises, make sure to run `temporal server start-dev --ui-port 8080 --db-filename clusterdata.db` in one terminal to start the Temporal server. For more details on this command, please refer to the `Setting up a Local Development Environment` chapter in the course. Note: If you're using the Codespaces environment to run this exercise, you can skip this step.

## Hands-On Exercises

Directory Name                     | Exercise
:--------------------------------- | :-------------------------------------------------------
`exercises/durable-execution`      | [Exercise 1](exercises/durable-execution/README.md)
`exercises/testing-code`           | [Exercise 2](exercises/testing-code/README.md)
`exercises/debug-activity`         | [Exercise 3](exercises/debug-activity/README.md)


## Examples for Self-Study
Directory Name                         | Description
:------------------------------------- | :----------------------------------------------------------------------------------
`samples/age-estimation`               | [Calls a remote API to estimate age of a person given their name](samples/age-estimation)
`samples/using-objects-for-data`      | [Demonstrates how objects are passed in as input and output data](samples/using-objects-for-data)


## Reference
The following links provide additional information that you may find helpful as you work through this course.
* [General Temporal Documentation](https://docs.temporal.io/)
* [Temporal TypeScript SDK API Documentation](https://typescript.temporal.io)


## Exercise Environment for this Course
You can launch an exercise environment for this course using GitHub Codespaces by 
following [this](codespaces.md) walkthrough.

Alternatively, you can follow 
[these instructions](https://learn.temporal.io/getting_started/typescript/dev_environment/) to 
set up your own Temporal Cluster with Temporal CLI, which you can use as an exercise environment.
