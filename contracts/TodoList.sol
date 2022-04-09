pragma solidity ^0.5.0;

contract TodoList{
	uint public taskCount = 0;

	struct Task {
		uint id;
		string content;
		bool completed;

	}

	mapping(uint => Task) public tasks; // like creating an array but cant show like an array cuz its dynamic and need hash

	constructor() public{
		createTask("Ok bruh.");
	}

	function createTask(string memory _content) public {
		taskCount++;
		tasks[taskCount] = Task(taskCount,_content, false);
	}


}
