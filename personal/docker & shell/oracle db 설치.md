
```sh
version: "3"

services:
	oracle-19c:
		container_name: oracle-19c
	environment:
		- ORACLE_SID=ORCLCDB
		- ORACLE_PDB=ORCLPDB1
		- ORACLE_PWD=1234
	image: doctorkirk/oracle-19c
	ports:
		- 1521:1521
		- 5500:5500
	volumes:
		- ./oracle-19c/oradata:/opt/oracle/oradata
```

```sh
mkdir oracle-19c/oradata
```


```
chmod -R 54321:54321 ./oracle-19c
```

username system
pwd 1234