import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.logging.LogType;
import org.openqa.selenium.logging.LoggingPreferences;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.logging.Level;

public class Main {
    public static void main(String[] args) {
        final String beginPort = args[0];
        final String endPort = args[1];
        final String nScans = args[2];
        final String nSockets = args[3];
        final String socketTimeout = args[4];
        final String scanningTechnique = args[5];
        System.out.printf("beginPort: %s, endPort: %s, nScans: %s, nSockets: %s, socketTimeout: %s, scanningTechnique: %s%n",
                beginPort, endPort, nScans, nSockets, socketTimeout, scanningTechnique);
        System.out.println("Setting up selenium port scanner");
        System.setProperty("webdriver.chrome.logfile", "/home/chromedriver.log");
        System.setProperty("webdriver.chrome.verboseLogging", "true");
        System.setProperty("webdriver.chrome.whitelistedIps", "");
        // Create a new instance of the Chrome driver
        final ChromeOptions chromeOptions = new ChromeOptions();
        chromeOptions.addArguments("--headless", "--remote-allow-origins=*", "--ignore-ssl-errors=yes", "--ignore-certificate-errors");
        final WebDriver driver = new ChromeDriver(chromeOptions);


        try {
            System.out.println("Starting port scanner");
            driver.get(String.format("http://localhost:3001/?begin_port=%s&end_port=%s&n_scans=%s&n_sockets=%s&socket_timeout=%s&scanning_technique=%s",
                    beginPort, endPort, nScans, nSockets, socketTimeout, scanningTechnique));
            driver.findElement(By.id("startPortScanner")).click();
            final WebDriverWait wait = new WebDriverWait(driver, Duration.ofMinutes(10));
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("finished")));
            System.out.println("Port scanning finished");
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        } finally {
            System.out.println("Stopping driver");
            driver.close();
            driver.quit();
        }
    }

}