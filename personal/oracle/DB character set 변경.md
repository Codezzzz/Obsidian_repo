https://roviet.tistory.com/4

```
shutdown immediate;

start mount

alter system set job_queue_processes=0;

alter system set aq_tm_processes=0;

alter database open;

alter database character set ko16ksc5601;

#ora-12712 에러
alter database character set internal_use ko16ksc5601;

# ora-12719 에러
alter system enable restricted session;

alter database character set ko16ksc5601;
```