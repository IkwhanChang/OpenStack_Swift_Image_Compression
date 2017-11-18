# openStack-swift-image-compression
The new policy for Openstack Swift

In this project, OpenStack Swift is used to providing web developers with a custom policy to automatically compress resources such as images. Recently, web developers are using resources that are cheaper and unlimited traffic with cloud storage service like Amazon AWS S3, which enables developers such as image servers to automatically compress resources and fix the speed of web pages thus we can increase the performance of web page.

## Contributors
- Ikwhan Chang (ikwhan.chang@sjsu.edu)
- Prashanth Iyengar (prashanth.ivengar@sjsu.edu)
- Priya Vishnu (priya.vishnu@sjsu.edu)

## References
- Slides: http://www.slideshare.net/izie00/image-compression-storage-policy-for-openstack-swift-71701321
- Video: https://www.youtube.com/watch?v=lqAnk5Hf4xM&t=1s

## Description of the Project
1. Analyzing the source code of the complicated OpenStack Swift, how to modify the code, how to modify the individual storage policy, and what factors See if the developer can set the desired policy. 
2. Identify the difference from the existing policy by putting the policy on the specific storage of the actual OpenStack Swift. 
3. When the user uploads the file, if the file is an image file, develop the logic to save the compressed image. In our project, we can create and use a compressed file in the same format as [File Name]_compressed.[Extension] according to one upload request of user or developer.


## Goals of the Project
1. Analyze the Swift Code as our first step. The OpenStack Swift source code is made up of a huge amount of Python sources. The file diskfile.py is composed of more than 3000 lines of source code and more than 50 methods. So understanding Swift is essential. 
2. Understood the swift proxy code flow. Once you have completed the primary analysis, you will understand what each method does for Swift, which consists of the actual proxy server and the object server. 
3. Identify the files that we need to modify to implement an additional storage policy. Analyze the source to see where you can link the policy to the real world. 
4. Identified the most suitable image compression technique. PIL (Python Image Library), Open CV, etc. to see what image compression algorithm can be applied. 
5. Modified the Swift code to add the new image compression policy and integrated the compression procedure 
6. Developed a web page to demonstrate the usage of the new policy.

## Project Architecture
![Project Architecture](https://matthew.kr/wp-content/uploads/2017/11/Screen-Shot-2017-11-18-at-10.19.01-AM.png)
For our implementation, we need to design and analyze the architecture as shown in Figure 2. First we need to understand how the OpenStack Swift works, and the protocol it provides. OpenStack Swift provides its own Web Server Gateway Interface (WSGI) via the REST API and its own Command Line Interface (CLI). In other words, you can connect via the web through your own WSGI. First, we decided to use the web interface for testing. Next, we analyzed the architecture of the entire OpenStack Swift and planned to make plan A and plan B, as shown in Figure 3, about which image compression should go. OpenStack Swift consists of proxy Server and object Server. In actual practice, we thought that the two servers would be separated, so we tried to perform image compression on the proxy server where files were originally delivered and collected. In other words, when an object is received from a proxy server, the file is compressed and replaced.

However, plan A had two major problems. First, when a lot of objects are delivered, the proxy server itself is slowed down, which hinders overall performance. The proxy server aims to deliver the object correctly to the object server depends on what is preset in the ring file. By bypassing this sort of bypass function from proxy to object, and doing something to the proxy server itself, performance can also be affected on object servers in zones where real objects are not stored. Second, when the proxy server receives the first file, it will split the file into chunks in a predefined unit of 500 bytes and send it sequentially. In this process, there is a certain metadata that is created first, but the compressed file does not correctly recognize it. Even if replacement is correct, it is not downloaded if it is actually stored in the object server.

So, we decided to start with object server in plan B shown in Figure 2. Therefore, we analyzed the other policies and confirmed that the implemented replication policies are implemented in the object server. That is, the most important file is diskfile.py file. In this file, there is a specific manager module as shown in Figure 3, and writer module and reader module that are re-inherited in base module and processed differently based on user’s request of REST API. So, we decided to create a manager in diskfile.py like the other policy, and create a writer to modify the file processing here. As with plan A, because the creation of the metadata failed, our solution is as follows: 
1) Intercept the file in the middle. 
2) Compress the intercepted file and save it in /var/tmp/. 
3) Upload the file saved in /var/tmp/ with _compressed after the file name using Swift CLI. 
4) As in (1), if the file name is “_compressed”, do not proceed with steps (2)-(4). 

In conclusion, when we upload a file called A.jpg, A_compressed.jpg file is created, so that the compressed file can be named as A_compressed.jpg at the convenience of web developer.

![Figure 4: Source code within diskfile.py](https://matthew.kr/wp-content/uploads/2017/11/Picture11.png)
(Figure 4: Source code within diskfile.py)

## Implementation
For our project, we needed to build a server environment first. The server used Google Compute Engine and used two virtual CPUs, 7.5GB of memory and two 100GB block storage hard disks. The operating system used Ubuntu Server 14.04 LTS image and OpenStack Swift 2.11.1dev46. I installed the proxy server and the storage server on one server by referring to the SAIO [5] manual.

For the development of our project, Swift itself modified the swift/obj/diskfile.py file as shown in Figure 4. First, we named the image compression policy COMP_POLICY and applied it to the file in Table III. The first time we tried to modify the proxy server, we decided to change diskfile.py to handle the actual file saving by changing the way. Therefore, first add the CompressedDiskFileManager module as shown in Figure 4, and register it in policy. Later, by defining CompressedDiskFileWriter and CompressedDiskFileReader, we create a part that can handle HTTP request / response and Swift command. Our program defines a new file writing part, so we mainly worked on CompressedDiskFileWrite, and we got the file stored in this area and uploaded the compressed file through Swift command.

## Test Scenario
As shown in Figure 5, there are two test scenarios. First, there is REST API processing when the user uploads the file and processing by the actual OpenStack Swift. Second, when the user presses the Run the Demo button after the upload is completed, the original image and the compressed image are called at the bottom of the test page It is about comparing image load speed and size with Chrome Developer Tools.  

More specifically, in a web page composed of AngularJS and Dropzone.js [7], the user requests a file upload via drag-and-drop. The client invokes the file upload portion of the Node.js middleware via an Ajax request. In the middleware, the actual byte stream of the file in the multipart form is first transmitted through the Swift REST API implemented by us. The Swift server receives the request and handles file storage in CompressedDiskFileWriter in diskfile.py mentioned in the above architecture. We do the actual processing in the _finalize_put_() method with our implemented image compressor. After that, through Run the Demo, AngularJS makes a content request to middleware and shows it through REST API.

![Figure 5: The procedure of testing to upload/load compressed image file](https://matthew.kr/wp-
(Figure 5: The procedure of testing to upload/load compressed image file)content/uploads/2017/11/Picture12.png)

## Performance
![Table I. The Result of the Test Scenario ](https://matthew.kr/wp-content/uploads/2017/11/Screen-Shot-2017-11-18-at-10.23.17-AM.png)
(Table I. The Result of the Test Scenario )
Table I shows our test results. A total of four images were tested, showing an average 28.28% reduction in image capacity and an average increase in page throughput of 32.46%. The result is larger in the visual area that the user can see. In fact, it takes 8 seconds to load a 15MB HD image shown in Table I, Image #4 While the compressed HD file shows a result of 2.74 seconds, which still allows the user to view the image quite nicely. 

## License

[MIT](LICENSE.md) © [Matthew Chang](https://www.matthewlab.com)
