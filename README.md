# Frontend Challenge

Contains my code to implement the frontend challenge task

Single page application that reads in a CSV file, uploaded from the user's computer, sum up all the data lines in a separate process, and outs it back on the same page, in the form of an HTML table.

**Additional Feature Implemented:**  
Ordering the table with click on the column titles  
  
Note: To test it requires a WebServer because it works with workers  

**How to test it (using docker nginx image port 8080 change the port if busy):**  
  
- git clone https://github.com/JuanDavidVelezAlvarez/frontendchallenge.git  
- cd frontendchallenge  
- docker run -it --rm -d -p 8080:80 --name web -v $(pwd):/usr/share/nginx/html nginx  
- Go to chrome and open http://localhost:8080/index.html  

**To do:**  
  
- Tests  

![image](https://user-images.githubusercontent.com/116565655/197903730-e86a28fc-8bdb-4489-a145-3e4e5c38389b.png)
