```java
registry.addMapping("/**").allowedOrigins("http://211.39.140.174:3100", "http://localhost:9001")
        .exposedHeaders(HttpHeaders.CONTENT_DISPOSITION)  // 파일 이름 관련 allow header
        .allowedMethods(HttpMethod.GET.name(),  
                HttpMethod.HEAD.name(),  
                HttpMethod.POST.name(),  
                HttpMethod.PUT.name(),  
                HttpMethod.DELETE.name());
```