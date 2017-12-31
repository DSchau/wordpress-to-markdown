export const author = `ctosspon`;
export const date = `Wed, 20 Dec 2017 17:07:16 +0000`;
export const title = `Dynamic SFTP Connection Factory for Spring Integration`;
export const slug = `dynamic-sftp-connection-factory-for-spring-integration`;
export const content = `
I recently had the opportunity to dive into a Spring Integration project that presented an interesting challenge: the creation of a outbound SFTP Connection Factory at runtime based on Spring Batch jobs. 

In a simple outbound SFTP integration, configuration for Spring Integration is quite succinct. You simply need to define the MessageChanel that the SFTP adapter will listen to, the SessionFactory containing the SFTP details, and the  IntegrationFlow that defines the path of the message to be processed. Below is an example of a simple Integration flow for a single, static SFTP outbound connection:

<pre lang="groovy" escaped="true">
@Bean
MessageChannel outboundSftpChannel(){
    new DirectChannel()
}  

@Bean
SessionFactory sftpSessionFactory(){
    def sessionFactory = new DefaultSftpSessionFactory(false)
    sessionFactory.host = 'host'
    sessionFactory.port = 1234
    sessionFactory.user = 'user'
    // ...

    sessionFactory
}

@Bean
IntegrationFlow sftpOutboundFlow(SessionFactory sftpSessionFactory){
    IntegrationFlows.from('outboundSftpChannel')
        .handle(Sftp.outboundAdapter(sftpSessionFactory)
        .remoteDirectory('/tmp/' ))
        .get()
}

</pre>

This works well for a single SFTP connection, but what if we wanted to define multiple connections, each with a unique host/username? Well, Spring Integration provides the DelegatingSessionFactory class to do that. 

The DelegatingSessionFactory contains a SessionFactoryLocator that finds the correct SessionFactory based on a ThreadKey that is set when the message is being written to the MessageChanel. This means you can wire up several SFTP connections or read them from your configuration, place them in their own session factories and have the proper SessionFactory create a SFTP connection for you as the message flows through the defined pipeline. To set that up is also quite simple. With just a few adjustments to our previous configuration, we are able to facilitate the DelegatingSessionFactory.


<pre lang="groovy" escaped="true">
@Bean
MessageChannel outboundSftpChannel(){
    new DirectChannel()
}  

@Bean
DelegatingSessionFactory delegatingSessionFactory(){
  def firstSessionFactory = new DefaultSftpSessionFactory(false)
  firstSessionFactory.host = 'host'
  firstSessionFactory.port = 1234
  //...

  def secondSessionFactory = new DefaultSftpSessionFactory(false)
  secondSessionFactory.host = 'hosttwo'
  secondSessionFactory.port = 1234
  //...

  def defaultSessionFactory = new DefaultSftpSessionFactory(false)
  defaultSessionFactory.host = 'default'
  defaultSessionFactory.port = 1234
  //...

  def sessionFactoryMap = [0:firstSessionFactory, 1: secondSessionFactory]

    new DelegatingSessionFactory(sessionFactoryMap, defaultSessionFactory)
}

@Bean
IntegrationFlow sftpOutboundFlow(DelegatingSessionFactory delegatingSessionFactory){
    IntegrationFlows.from('outboundSftpChannel')
        .handle(Sftp.outboundAdapter(delegatingSessionFactory)
        .remoteDirectory('/tmp/' ))
        .get()
}
</pre>


With this configuration, I have specified 3 different connection factories for my SFTP endpoints. As long as we specify the appropriate Thread key, the proper SFTP connection will be initiated and our single SFTP adapter can now handle multiple endpoints. This works well for any process that has a long and stable life, but what if the process that feeds the outboundSftpChannel is more dynamic? What if there is a business use case to be able to add/change/remove SFTP connections at runtime? How can we solve for that?

There are many ways the DelegatingSessionFactory and it's factory locator can be updated at runtime. The default locator implementation even provides public methods to do so. Add a connection, run the process that invokes this outbound SFTP channel, and you're done. 

I didn't do that.  

The methods for the DefaultSessionFactoryLocator weren't quite dynamic enough. The SFTP process required the registration of the new connection prior to a message sent down the pipeline for that connection. I hated the thought of having to add <b>more</b> configuration to facilitate what is supposed to be a dynamic process. Why ask the users to remember to set up the new connection in the configuration store (database, file, etc) and have to invoke whatever endpoint would need to be designed to call the appropriate methods? We should let the application control it's own process.


I injected a custom factory locator functionally similar to the default session factory locator with one key difference: instead of requiring a separate, manual process to register a new session factory with the locator, it would instantiate a new session factory if the right one isn't in factory storage. 


<pre lang="groovy" escaped="true">
@Component
class ExampleRuntimeSessionFactoryLocator implements SessionFactoryLocator {

    private final Map sessionFactoryMap = [:]

    @Override
    SessionFactory getSessionFactory(Object key) {
        def sessionFactory = sessionFactoryMap[key]

        if (!sessionFactory){
            sessionFactory = generateSessionFactory(key as Long)
            sessionFactoryMap[key] = sessionFactory
        }

        sessionFactory
    }

    private DefaultSftpSessionFactory generateSessionFactory(Long key){
        new DefaultSftpSessionFactory(
                host: 'host',
                port: 1234,
    //...
        )
    }
</pre>

And to wire it up in the Spring Integration Configuration, a small change is required to the DelegatingSessionFactory.


<pre lang="groovy" escaped="true">
@Bean
    DelegatingSessionFactory delegatingSessionFactory(ExampleRuntimeSessionFactoryLocator runtimeSessionFactoryLocator){
        new DelegatingSessionFactory(runtimeSessionFactoryLocator)
    }
</pre>  


And with that, anytime a message is sent on the SFTP outbound channel, the application will automatically wire up any relevant session factories for use. 

If you want to see an example project with all of these pieces in place with the addition of looking up the SFTP connection information from a database table, I have uploaded the example code to my <a href="https://github.com/cTwospoons/dynamic-sftp-outbound" rel="noopener" target="_blank">GitHub</a>.
`;
