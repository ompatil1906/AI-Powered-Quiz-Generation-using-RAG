export const DEFAULT_LESSON_ID = 'agent-mcp-lesson';

export const DEFAULT_TRANSCRIPT = `[00:00:00]
So everyone's talking about MCPs, AI agents, and agent to agent protocol.
[00:00:05]
If you feel left out, this is the only video you need to watch to catch up.
[00:00:09]
In this video, we'll talk about AI agents, MCPs, and agent to agent model in a super simplified manner with visualizations that will make it easy for anyone to understand.
[00:00:18]
No background knowledge in AI or AI models or coding or programming required.
[00:00:24]
In the first part, we'll explain the why and the what behind these concepts.
[00:00:28]
And then in part two, we'll dive into some code and understand the how behind its implementation.
[00:00:34]
And you'll also get access to a hands on lab that you can use to practice this as you watch this video.
[00:00:39]
So we'll start with something we already know, ChatGPT.
[00:00:42]
So what is ChatGPT?
[00:00:44]
It is really two things, a chat application and a g p t attached to it.
[00:00:49]
The chat part itself is just an application like any other chat app that we know.
[00:00:55]
The g p t part is the large language model.
[00:00:57]
That's the AI.
[00:00:59]
There are so many other LLMs that you have probably already heard of such as Claude from Anthropic, DeepSeek, Gemini, llama, etcetera.
[00:01:07]
But we're not going to get into more details about specifics of LLMs in this video.
[00:01:12]
We'll just refer to the AI as LLMs and that LLM could be any of these models for the remainder of this video.
[00:01:18]
That's all you need to know about LLMs.
[00:01:21]
So the way it works is when a user asks the question in Chargebee T, the application sends a request to the AI, which is the LLM and the AI generates a response and sends it back to the application and displays the results on screen.
[00:01:35]
Now let's say we are building an application called FlyGPT similar to ChargeGPT and we wanted to book a flight for the user.
[00:01:42]
If I ask it a question, say I would like to fly to North London, it should book a flight for me.
[00:01:48]
So we need a magical something that my application can interact with that would understand my request and do as I say.
[00:01:56]
Based on what we just discussed, that magical thing would be AI in the form of LLM.
[00:02:01]
But if you look at the response, it's just returned instructions in the form of text to me.
[00:02:06]
It did not actually book the flight for me.
[00:02:09]
You see that's all an LLM can do natively.
[00:02:12]
An LLM can generate responses in the form of text, pictures or videos, but cannot by itself do anything or take any action.
[00:02:22]
But what does taking an action mean here?
[00:02:24]
When I say I would like to fly to North London, my application should be able to interact with these third party flight services such as JoyAir or TrackAir or Aerogo and retrieve flight details from these sites.
[00:02:38]
And then also compare that against, say my preferences such as whether I prefer cheap or luxury flights, my seat preferences or meal preferences.
[00:02:46]
And based on all of that information, make a decision for me and not stop until it's retrieved enough information to be able to make a decision and then book the flights for me and tell me the flight details and booking reference numbers.
[00:02:58]
So I'd like my AI to take action for me.
[00:03:01]
So we need something magical, something that can do that for us.
[00:03:05]
And what is that?
[00:03:06]
Those are called AI agents.
[00:03:09]
AI agents are able to interact with third party platforms or websites, gather information and combine that with a memory that it has based on our previous conversations and then interact with an LLM which is a real AI here to make a decision forming.
[00:03:21]
And that magical thing is known as an AI agent.
[00:03:24]
An AI agent can interact with third party tools, have its own memory and interact with an LLM and go back and forth between these operations multiple times to eventually be able to have enough knowledge to make a decision for me.
[00:03:36]
And then also take an action to book a flight for me and not stop until it's done that job.
[00:03:40]
That's what an AI agent does.
[00:03:43]
Now, one of the most common examples of agents that we work with are IDEs that we work with every day.
[00:03:48]
If you have worked with cursor, WinSurf or Versus code and used GitHub Copilot, they have this agent mode that makes them work as an agent.
[00:03:55]
And what does that really mean work as an agent?
[00:03:57]
In the past, in the non agent era, if you ask a question, it would give you an answer.
[00:04:02]
That's all.
[00:04:03]
In an agent mode, you can give it one task, a big task even, such as build an entire app or troubleshoot an issue.
[00:04:09]
It goes through the sequence of multiple AI calls and interacting with the code base as well as the terminal if needed, and does not stop until it's done what you asked it to do.
[00:04:19]
That's the difference between a chatbot calling one LMM call to an AI agent that performs a series of different tasks until it gets things done.
[00:04:28]
Now one of the real world use cases of AI agents is in software development.
[00:04:33]
You can ask it a question like we recently noticed that a button was missing on the UI will help me identify when and how this changed and share a plan to revert it.
[00:04:41]
And the AI agent now scans through the code bases, looks at the front end and the back end code and also the Git history by the terminal and finally tells you exactly which command caused this change and even how to revert that change or fix it.
[00:04:53]
So how do I get started with agents?
[00:04:55]
There are platforms that have built pre built agents that you can call like agent dot ai, for example, where people have built hundreds of agents that perform different kinds of tasks like video script generators or web design graders, etcetera.
[00:05:06]
You can integrate these directly in your application by invoking them remotely.
[00:05:11]
Or you could build your own agents using tools like Anyten without having to actually code.
[00:05:15]
NA ten gives you the ability to drag and drop and build your own agents.
[00:05:19]
Some example workflows available on NA ten include automating generating AI videos, on YouTube, intelligent email organization with content classification, etcetera.
[00:05:29]
Another option would be for you to build an agent from scratch using platforms like lang chain or lang graph.
[00:05:35]
But we won't get into this in any more detail for now.
[00:05:38]
We have an entire course that covers these topics on our platform.
[00:05:41]
So coming back to this, we said that an agent can interact with third party platforms this way, but how does an agent really interact with a third party platform?
[00:05:51]
It does that through what are known as tools.
[00:05:54]
A tool allows the agent to interact with another platform.
[00:05:57]
Let's take a closer look at that.
[00:05:59]
So here, the agent has the ability to interact with these airlines using a tool for each one.
[00:06:04]
But how does that tool interact with an airline?
[00:06:06]
So here's a quick heads up.
[00:06:08]
If you know about APIs already, you may want to skip ahead a few minutes.
[00:06:11]
If you don't or need a refresher, stay on and allow me to explain.
[00:06:15]
But let's forget about AI and tools for a second and see how we interact with these airlines as a human user.
[00:06:21]
So as a human user, say I would go to the airlines website at say w w w dot emirates dot com and see that it's returns me a web page and click around to find a flight as per my preference and book the flight.
[00:06:33]
And this is known as the UI or the user interface of the airline.
[00:06:38]
So you have the websites or mobile apps all fall into this category.
[00:06:41]
But if I were not a human user instead if I was a third party website like make my trip or booking dot com or cheap flights, I'm an application trying to communicate with another application.
[00:06:51]
In the past, what these third party applications did is scrape the websites, which is basically saving the website as a text file.
[00:06:57]
And when they scrape the website, you get a junk text like this, which is the HTML.
[00:07:01]
But within that junk lies the information you need, which are the flight details and so they would run complex algorithms against these to pull the required flight details from here.
[00:07:10]
So eventually the airlines realized it's beneficial for them too to be on these third party platforms.
[00:07:14]
So the airlines told them instead of going to emirates dot com, you can go to emirates dot com slash API slash flights.
[00:07:20]
And when you do that, we will just send you the flight details in a structured format.
[00:07:24]
So you don't have to do any crazy parsing algorithms.
[00:07:27]
And that interface that applications provide to other applications is known as an application programming interface or APIs.
[00:07:37]
Not only did this say you could retrieve flight details if you call the slash API slash book flights then we would book the flight tickets for you and return the booking reference number so you can let your customers book the flights from your own website without even coming to our site.
[00:07:51]
Now I'm super simplifying this.
[00:07:52]
So if you go to these URLs, it won't work like this because it requires authentication and authorization and other mechanisms.
[00:07:58]
But we have a hands on lab that will help you learn all about this MCP.
[00:08:01]
So check it out using the link in the description below.
[00:08:04]
I'll also walk you through the lab at the end of this video.
[00:08:06]
So just to summarize that, the interface that users use to interact with the site is called the user interface and the interface that the applications use to interact is called as an API.
[00:08:15]
So back to this, now that we know how applications interact with applications, how do you think tools interact with airlines?
[00:08:21]
Well through APIs.
[00:08:23]
So each tool is a piece of code that interacts with the API of the respective airlines to retrieve flight information and those details are then shared with LLMs to make a decision.
[00:08:34]
And then based on the decision, the agent uses the tool again to make another API call to book the flight on the respective airlines.
[00:08:41]
In this case, if the agent made another API call to the JoyAir to book the flight on that airline.
[00:08:48]
Now if you take a closer look at that call, you'll see that each call is different.
[00:08:53]
The first one is slash API slash flights.
[00:08:55]
The second one is slash flights dash list.
[00:08:58]
The third one is list flights and, also their responses are different too.
[00:09:02]
The first flight returns, information in a format that has flight number, origin, destination.
[00:09:08]
The second one returns, information that says flight number from and to.
[00:09:12]
And the third one says detailed flights and flight and start and finish, etcetera.
[00:09:17]
So each airline has its own standard when it comes to their APIs.
[00:09:20]
There are hundreds of airline sites and there are millions of other third party sites.
[00:09:24]
And if I want my application to interact with all of them, do I now need to write all of these adapter codes?
[00:09:30]
Now we are in the AI world and I shouldn't have to do this.
[00:09:33]
Well, gone are those days where I would sit and write programs to connect to these different flight service providers one by one.
[00:09:39]
Why can't AI just do it for me?
[00:09:41]
Only if there was some magical solution that existed that could do that for me.
[00:09:46]
And so comes MCPs or model context protocols.
[00:09:49]
Well, think of MCPs as a guide for the AI's to choose the right APIs and interact with the third party platforms.
[00:09:55]
Well, MCPs provide agents the context they need to make the right API calls.
[00:10:00]
What does that mean?
[00:10:02]
For example, it might look like this.
[00:10:04]
In this case, the MCP tells the agent that JoyAir has search flights and book flight capabilities.
[00:10:10]
And the input structure looks like this and the output structure looks like this.
[00:10:14]
And we'll dig deeper into the implementation of this, in the part two when it comes to building an MCP server.
[00:10:21]
So MCP was introduced by Anthropic, the company behind Claude and has since been open source and is now the default standard used by everyone to build AI agents.
[00:10:29]
So if you go to model context protocols slash servers, you can find MCP servers for a long list of applications.
[00:10:35]
Now every agent has an MCP configuration file located at m c p dot conf at some location depending on what agent you're using.
[00:10:42]
So you must specify the name of the MCP.
[00:10:45]
In this case, it's MongoDB, the command and arguments associated with it, associated with running the MongoDB MCP server.
[00:10:53]
In this case, the arguments are MongoDB's connection string to reach the database which is my local database.
[00:10:58]
This allows the agent to use the MCP server's abilities to connect to the database and retrieve information as well as make modifications to the data.
[00:11:06]
Now in my case, it's a local database.
[00:11:08]
The location of this file depends upon the tool being used.
[00:11:11]
Cursor, for example, has this path specified at the dot cursor directory in the user's home directory.
[00:11:17]
For windsurf, it's under the dot codium slash windsurf directory and this is a path for the configuration file for Claude.
[00:11:26]
So going back to this, MCP server works in a client server model.
[00:11:29]
So instead of interacting with the API directly, we now have the MCP server for each of these airlines.
[00:11:35]
And then you have an MCP client and the agent that interacts with these MCP servers.
[00:11:42]
And so a combination of AI agents that has memory, has cold driven behavior and has access to AI as an L M with MCP servers that helps AI agents discover the capabilities of third party applications help us build magical solutions to problems.
[00:11:56]
Now it's time for us to expand and scale up.
[00:11:59]
This agent can only book flights but what if we want to expand our use case to book hotels too?
[00:12:04]
So one thing I could do is expand this agent to add more MCP servers to also connect to hotels, but that's going to add bloat to my agent.
[00:12:13]
Now my agent needs to be good at two things and remember my preferences for two things.
[00:12:18]
I might have amenities, beds and other preferences for my hotel which are different from those for flights.
[00:12:23]
So we ideally want one agent to do one thing and do that thing really really well.
[00:12:28]
And so our next option is to build a new agent that can do the hotel booking really well.
[00:12:33]
That has its own integration with MCP servers and has its own memory with those specific preferences and my original agent is going to call this agent.
[00:12:40]
So that's an agent to agent call.
[00:12:42]
Now I have one flight agent that's really good at finding and booking flights, and I have another hotel agent that's really good at booking hotels.
[00:12:50]
But how does one agent talk to another agent?
[00:12:53]
How does one agent know what are the capabilities of another agent?
[00:12:56]
What format can one agent pass information to another agent?
[00:12:59]
Well, this is where the agent to agent model comes in.
[00:13:02]
The agent to agent model was developed by Google with the goal of making it possible for agents to be able to collaborate in a dynamic multi agent ecosystem with support and contributions from a lot of other partners in the ecosystem.
[00:13:15]
So how does it work?
[00:13:16]
The agent to agent model allows one agent to discover capabilities in the other agent.
[00:13:21]
For example, the flight agent can ask the hotel agent, what can you do?
[00:13:25]
The hotel agent responds with its capabilities that it can search and book hotels.
[00:13:29]
Then the flight agent gives the hotel agent a task to search for the best hotels.
[00:13:34]
And then the hotel agent responds back with the results of that task.
[00:13:38]
So agent to agent, model defines a set of standards that allows agents to discover each other's capabilities.
[00:13:44]
It defines a standard to assign task to another agent and check its status.
[00:13:48]
It defines a standard on how agents communicate with each other and also defines how context and results are shared back and forth between agents.
[00:13:56]
We'll see this in more detail in part two of this video.
[00:14:04]
Here's one use case that we spoke about earlier with reference to development.
[00:14:07]
Say if I have an issue with my application, I could say we recently noticed that a button was missing, help me identify when and how this changed and show a plan to revert.
[00:14:15]
The AI agent interacts with the gateway history, reads the back end and front end code and then identifies the exact change or commit that caused this change.
[00:14:24]
The next use case is using AI agents and MCPs to build back end applications.
[00:14:28]
In this case, we are developing APIs and I'd like my agent to have access to the MongoDB database so that during the development of the APIs, the agent can test these APIs and make sure the data is available in MongoDB.
[00:14:41]
So this is a very helpful use case.
[00:14:43]
And then here's another one that we had internally.
[00:14:45]
So we have, three, data sources, Stripe, Google BigQuery, which is our data infrastructure.
[00:14:50]
And then we have Metabase, which is a visualization platform.
[00:14:53]
We had an issue where, we were missing an invoice detail from a particular Stripe record, and we were not able to identify which user that was for.
[00:15:01]
And so we tasked the AI agent, provided it access to these three data sources through MTVB servers, and was able to go on a five to ten minute, troubleshooting journey and eventually come back and, tell us, why it was missing and the particular transaction ID associated with that and the amount associated with that.
[00:15:19]
So, those are some examples of real use cases that the, MCP Servers, can be used for.
[00:15:24]
Next, we'll get, some hands on experience.
[00:15:27]
So we'll head over to the lab using the link given in the description below and, let's, quickly take a look at the hands on labs.
[00:15:35]
Alright.
[00:15:35]
In this lab, we're going to walk through simulation of the flight MCP with, Klein in our code, you know, in the Versus code editor.
[00:15:45]
So this is a free lab that's hosted on CoreCloud.
[00:15:48]
So use the link in the description below to gain access to this lab so that you can walk through it yourself.
[00:15:52]
So once you open the lab environment, you're given a set of instructions on the left side here and then you have a set of the Versus code editor here on the right.
[00:16:03]
So the there's some code here that you can ignore for now.
[00:16:06]
I'll explain all about it in a little bit.
[00:16:08]
So we'll start with a quick walkthrough.
[00:16:10]
So in this lab, we will explore how to configure the flight simulator server in client.
[00:16:14]
So client is similar to Cursor or our Windsurf but there's another agent here.
[00:16:19]
So if you click on this agent button here, this is a Versus code extension or plugin that behaves just like the cursor or WinSurf or other or GitHub Copilot that you might have worked with.
[00:16:32]
Right?
[00:16:32]
So let's click okay and go ahead.
[00:16:35]
So in the next step, here it says, let's set up client.
[00:16:37]
So we want to open the client interface by clicking on the robot icon on the left side of the embedded Versus code server.
[00:16:43]
So that's we've just already done that.
[00:16:44]
So the first step is to set up a client so that you can chat with it, chat with the AI.
[00:16:50]
So let's go to the next step.
[00:16:52]
Okay.
[00:16:52]
So the instruction here is to configure API key.
[00:16:55]
So you don't have to bring your own keys.
[00:16:57]
We we provide you the keys that are needed.
[00:16:58]
So but here you need to select user own API key.
[00:17:01]
And then in the API provider, you'll need to select open API compatible.
[00:17:06]
This one.
[00:17:07]
Right?
[00:17:07]
So now we need to provide a set of information regarding including the keys and those details are actually available here.
[00:17:12]
So it's already available in your environment.
[00:17:14]
So if you go to your home directory and bash underscore profile.
[00:17:22]
Here you have the keys that are needed for you to work with any of these endpoints during this lab.
[00:17:28]
And this is free for you to use and play around with as much as you want.
[00:17:32]
So in this case, we need the base URL.
[00:17:33]
So the base URL, we're gonna use OpenAI.
[00:17:35]
So I'm gonna copy this base URL from here, paste it here.
[00:17:38]
And then I need the API key.
[00:17:40]
So I'm gonna copy the API key for the OpenAI, from here to here.
[00:17:44]
And then I need the model IDs.
[00:17:46]
The model ID is going to be open AI slash g p t dash four point one.
[00:17:51]
And that's it.
[00:17:51]
And then you click let's go.
[00:17:55]
Okay.
[00:17:55]
So client is set up.
[00:17:57]
So just gonna close these messages and we'll send a quick test message to check if it can hear us.
[00:18:09]
So it's gonna send an API request and we'll see.
[00:18:12]
Yep.
[00:18:12]
It says I can receive a message and respond to your request.
[00:18:14]
I mean, what do you need help with?
[00:18:15]
Okay.
[00:18:15]
Alright.
[00:18:16]
So this step is complete.
[00:18:16]
So we're going to go ahead click okay and go to the next step.
[00:18:20]
Okay.
[00:18:20]
So now we're going to ask for flight details and observe that it's not working.
[00:18:23]
So we have not set up the MCP server yet, but I'm going to ask it to share flight details.
[00:18:28]
So I'm gonna say, can you check flight details for me from San Francisco to JFK for today?
[00:18:39]
And let's see if it's able to do that.
[00:18:45]
Okay.
[00:18:45]
So what it's not going to do is it's understood my request and it's gonna open Google and try and access, you know, publicly available file or flight information.
[00:18:54]
But that's not really what we need because we don't want it to go out and access the browser.
[00:18:59]
Instead, we wanted to use our MCP tool that already has that information.
[00:19:02]
Right?
[00:19:03]
So I'm just gonna reject that request and prevent it from going out.
[00:19:07]
And let's see how we can configure the MCP server.
[00:19:11]
It says I'm unable to access the browser to look up flight details.
[00:19:13]
Would like to provide access to a specific API or connect to MCP server.
[00:19:16]
So that's what I'm going to do.
[00:19:17]
And so to connect the MCP server, the steps here are to click on the server button at the bottom.
[00:19:22]
So here you have manage MCP server.
[00:19:24]
Servers.
[00:19:24]
I'm gonna click on that and then there's a settings icon.
[00:19:26]
And then here I have configure MCP servers.
[00:19:28]
I'm gonna click on that.
[00:19:29]
And what this does is it opens up this client MCP settings dot json file.
[00:19:34]
So for client, this is the the file that needs to be updated.
[00:19:37]
Then I'm gonna go here and copy this configuration and I'm gonna place it here.
[00:19:41]
So what this means is this is a list of MCP servers.
[00:19:44]
I'm gonna call mine flight sim or flight simulator.
[00:19:47]
And then there's this is basically a simple script that's located at root flight sim m c p and flight sim dash m c p dot s h.
[00:19:54]
So as soon as I put it here, it's already become available here.
[00:19:58]
As you can see, it's green.
[00:19:59]
This means this MCP server is ready to use.
[00:20:02]
I'm gonna click on done now.
[00:20:04]
But I just wanna take a minute and show you what the location of this file.
[00:20:08]
So you have this flight sim MCP here, which is this path.
[00:20:10]
And if you look into this, there is all the code that's written to run the this server.
[00:20:16]
So this is basically a Python file.
[00:20:17]
And if you expand this here, you're able to see this list of, the code here, and the SRC.
[00:20:25]
And then you can see the prompts and resources and tools and everything defined.
[00:20:28]
Don't look at this for now because we're going to have another video where we explain these in much more detail.
[00:20:33]
So let's go back to this and let me ask the same question again.
[00:20:36]
Can you help me find flights from SFO to JFK?
[00:20:44]
And we'll give it a minute for it to interact.
[00:20:46]
Okay.
[00:20:47]
So it says there's now an MTP server available flight sim that provides details of first search flights and all of that.
[00:20:52]
It's given me these details and it's done the search and it's actually got back with some of these details.
[00:20:58]
And it's going to make a call with some of these details as it's asking me for my permission.
[00:21:02]
I'm just gonna say approve.
[00:21:06]
Alright.
[00:21:06]
So it's identified the flight and, you can see the response here.
[00:21:12]
But, here's some more human readable format.
[00:21:14]
So it says there are these airlines that are available.
[00:21:17]
And so I'm gonna say book the cheapest flight for me and let's see what it what it does.
[00:21:28]
Now the capabilities of the flight MCP tool tells it that it can book the flight, which is this particular one, but it needs these inputs.
[00:21:35]
So the inputs are first name and last name.
[00:21:36]
So I'm just gonna give my name and email.
[00:21:40]
Let's say cloud dot com.
[00:21:43]
And then I'm gonna give you my phone number.
[00:21:46]
Right?
[00:21:46]
And let's see if we can pick that.
[00:21:52]
Okay.
[00:21:52]
It's got the passenger details and it's gonna it's going to do the booking.
[00:21:55]
It's asking me for an approval.
[00:21:56]
I'm gonna say approve.
[00:22:03]
I think there's some error in terms of validation.
[00:22:04]
I probably did not give the right information.
[00:22:07]
Yeah.
[00:22:07]
The phone number is not valid.
[00:22:09]
So let's say just say I'm gonna give it another number.
[00:22:20]
Okay.
[00:22:20]
I'm going to approve again.
[00:22:23]
Yeah.
[00:22:23]
I think there's, probably still got the phone number wrong.
[00:22:28]
Let's just copy and paste that.
[00:22:41]
Now while it does that, here's something else we could do.
[00:22:43]
Okay.
[00:22:43]
So that task is complete.
[00:22:44]
So it's able to book my flight and it's given me all the flight details and booking numbers and all of that, which is pretty cool.
[00:22:50]
Okay.
[00:22:51]
So that's a quick demo of using a flight simulator to MCP.
[00:22:54]
So go ahead and try this out yourself.
[00:22:57]
In the upcoming video and lab, we will have we'll see how to build your own MCP servers.
[00:23:01]
For now, if you'd like to play around with it, you can take a look at this code base and you can basically ask client to explain, read and understand code at this location and explain it to me.
[00:23:19]
Now as an agent, what it's able to do is it has access to the file and folder structure.
[00:23:24]
So it's going to spend some time reviewing the directory, reading the files, and understanding its structure and it's gonna be able to tell me and explain to me how it's all set up.
[00:23:39]
Okay.
[00:23:39]
So there it is.
[00:23:40]
So it's able to tell me that it uses a FastMCP server.
[00:23:43]
That's what I've used.`;
