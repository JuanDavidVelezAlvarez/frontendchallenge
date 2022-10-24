# Frontend Challenge

Contains my code to implement the frontend challenge task

Note: To test it requires a WebServer because it works with workers  

**How to test it (using docker nginx image port 8080 change the port if busy):**  
  
- git clone https://github.com/JuanDavidVelezAlvarez/frontendchallenge.git  
- cd frontendchallenge  
- docker run -it --rm -d -p 8080:80 --name web -v $(pwd):/usr/share/nginx/html nginx  
- Go to chrome and open http://localhost:8080/index.html  

**To do:**  
  
- Tests  

