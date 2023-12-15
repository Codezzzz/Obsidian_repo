```
ALTER USER WISENUT DEFAULT TABLESPACE USERS QUOTA UNLIMITED ON USERS;
```

```
- sqlplus sys as sysdba

- GRANT CREATE ANY TABLE TO WISENUT;

- GRANT CONNECT, RESOURCE, DBA TO WISENUT;
 - create user WISENUT identified by 1234;
```

```
select * from all_users

create user YICCHSCC identified by 1234;

GRANT CREATE ANY TABLE TO YICCHSCC;

GRANT CONNECT, RESOURCE, DBA TO YICCHSCC;

ALTER USER YICCHSCC DEFAULT TABLESPACE USERS QUOTA UNLIMITED ON USERS;

alter session set "_ORACLE_SCRIPT" =true;

create tablespace YICCHSCC datafile '/opt/oracle/oradata/ORCLCDB/users02.dbf' size 300m reuse autoextend on next 1024k maxsize unlimited;

```

```
 sqlplus system/pass@1234 @DATA_T_QUESTION_CONFIRM_UTF8.sql
```