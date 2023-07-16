import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.nio.file.Paths;
import java.time.Duration;

public class Main {
    public static void main(String[] args) {
        final String beginPort = System.getProperty("BEGIN_PORT");
        final String endPort = System.getProperty("END_PORT");
        final String nScans = System.getProperty("N_SCANS");
        final String parallelSockets = System.getProperty("PARALLEL_SOCKETS");
        final String socketTimeout = System.getProperty("SOCKET_TIMEOUT");
        final String scanningTechnique = System.getProperty("SCANNING_TECHNIQUE");
        final String containerName = System.getProperty("CONTAINER_NAME");

        System.out.printf("beginPort: %s, endPort: %s, nScans: %s, nSockets: %s, socketTimeout: %s, scanningTechnique: %s%n",
                beginPort, endPort, nScans, parallelSockets, socketTimeout, scanningTechnique);
        System.out.println("Setting up selenium port scanner");
        System.setProperty("webdriver.chrome.logfile", "/app/chromedriver.log");
        System.setProperty("webdriver.firefox.logfile", "/app/geckodriver.log");
        System.setProperty("webdriver.chrome.verboseLogging", "true");
        System.setProperty("webdriver.chrome.whitelistedIps", "");
        if(!containerName.equals("win-container")) {
            String chromeDriverPath = Paths.get("/opt/chromedriver").toAbsolutePath().toString();
            System.setProperty("webdriver.chrome.driver", chromeDriverPath);
            String firefoxDriverPath = Paths.get("/opt/firefox/geckodriver").toAbsolutePath().toString();
            System.setProperty("webdriver.gecko.driver", firefoxDriverPath);
        }

        final ChromeOptions chromeOptions = new ChromeOptions();
        chromeOptions.addArguments("--headless", "--remote-allow-origins=*", "--ignore-ssl-errors=yes", "--ignore-certificate-errors");
        final WebDriver driver = new ChromeDriver(chromeOptions);
//        final FirefoxOptions firefoxOptions = new FirefoxOptions();
//        firefoxOptions.addArguments("--headless=new");
//        firefoxOptions.addPreference("security.ssl.enable_ocsp_stapling", false);
//        firefoxOptions.addPreference("security.ssl.enable_ocsp_must_staple", false);
//        final WebDriver driver = new FirefoxDriver();
        try {
            System.out.println("Starting port scanner");
            final String url = String.format("http://localhost:3001/?begin_port=%s&end_port=%s&n_scans=%s&n_sockets=%s&socket_timeout=%s&scanning_technique=%s",
                    beginPort, endPort, nScans, parallelSockets, socketTimeout, scanningTechnique);
            System.out.printf("Scan url:%s%n", url);
            driver.get(url);
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