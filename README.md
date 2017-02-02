# OpenStack_Swift_Image_Compression
The new policy for Openstack Swift
In this project, OpenStack Swift is used to providing web developers with a custom policy to automatically compress resources such as images. Recently, web developers are using resources that are cheaper and unlimited traffic with cloud storage service like Amazon AWS S3, which enables developers such as image servers to automatically compress resources and fix the speed of web pages thus we can increase the performance of web page.

##Contributor
- Ikwhan Chang (ikwhan.chang@sjsu.edu)
- Prashanth Iyengar (prashanth.ivengar@sjsu.edu)
- Priya Vishnu (priya.vishnu@sjsu.edu)

## Related Slides
http://www.slideshare.net/izie00/image-compression-storage-policy-for-openstack-swift-71701321

##Description of the Project
1. Analyzing the source code of the complicated OpenStack Swift, how to modify the code, how to modify the individual storage policy, and what factors See if the developer can set the desired policy. 
2. Identify the difference from the existing policy by putting the policy on the specific storage of the actual OpenStack Swift. 
3. When the user uploads the file, if the file is an image file, develop the logic to save the compressed image. In our project, we can create and use a compressed file in the same format as [File Name]_compressed.[Extension] according to one upload request of user or developer.


##Goals of the Project
1. Analyze the Swift Code as our first step. The OpenStack Swift source code is made up of a huge amount of Python sources. The file diskfile.py is composed of more than 3000 lines of source code and more than 50 methods. So understanding Swift is essential. 
2. Understood the swift proxy code flow. Once you have completed the primary analysis, you will understand what each method does for Swift, which consists of the actual proxy server and the object server. 
3. Identify the files that we need to modify to implement an additional storage policy. Analyze the source to see where you can link the policy to the real world. 
4. Identified the most suitable image compression technique. PIL (Python Image Library), Open CV, etc. to see what image compression algorithm can be applied. 
5. Modified the Swift code to add the new image compression policy and integrated the compression procedure 
6. Developed a web page to demonstrate the usage of the new policy.

##Technical Aspects
We developed using various elements of the web. First, we created the API interface through Node.js for the REST API provided by OpenStack Swift. Second, using the latest web development technologies, such as AngularJS and Bootstrap, the test client's programs have made the same experience for front-end developers. Third, by installing the Swift-All-In-One (SAIO) version of OpenStack, existing users can easily install Swift and run Object Server. Fourth, we used Bower and Npm to manage the dependency of the test client. Finally, Github allows the source code to be easily followed when committing custom libraries to other users, depending on the commit and archive. In order to understand this project, it is necessary to understand basic REST API of SDN, SDS and Web, and techniques such as Node.js and AngularJS.

##Environments
We needed to build a server environment first. The server used Google Compute Engine and used two virtual CPUs, 7.5GB of memory and two 100GB block storage hard disks. The operating system used Ubuntu Server 14.04 LTS image and OpenStack Swift 2.11.1dev46. I installed the proxy server and the storage server on one server by referring to the SAIO manual.
Architecture
For the development of our project, Swift itself modified the swift/obj/diskfile.py file as shown in [Figure 3]. First, we named the image compression policy COMP_POLICY and applied it to the file in [List 1]. The first time we tried to modify the proxy server, we decided to change diskfile.py to handle the actual file saving by changing the way. Therefore, first add the CompressedDiskFileManager module as shown in [Figure 3], and register it in Policy. Later, by defining CompressedDiskFileWriter and CompressedDiskFileReader, we create a part that can handle HTTP request / response and Swift command. Our program defines a new file writing part, so we mainly worked on CompressedDiskFileWrite, and I got the file stored in this area and uploaded the compressed file through Swift command.



