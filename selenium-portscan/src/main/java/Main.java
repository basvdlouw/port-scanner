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
//        WebDriverManager.chromedriver().setup();
//        System.setProperty("webdriver.chrome.driver", "/path/to/chromedriver");
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
            driver.get("http://localhost:3001/?begin_port=1&end_port=65536&n_scans=1&n_sockets=200&socket_timeout=300&scanning_technique=fetch");
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