function Get-OpenPorts {
    [CmdletBinding()]

    $udpPorts = Get-NetUDPEndpoint | Select-Object LocalAddress, LocalPort, OwningProcess
    $tcpPorts = Get-NetTCPConnection | Select-Object LocalAddress, LocalPort, RemoteAddress, RemotePort, State, AppliedSetting, OwningProcess

    $ports = $tcpPorts + $udpPorts

    $mappedPorts = @()
    foreach ($port in $ports) {
        $process = Get-Process -Id $port.OwningProcess -ErrorAction SilentlyContinue
        $processName = if ($process) { $process.ProcessName } else { 'Unknown' }
        $mappedPort = @{
            Protocol = if ($port -in $tcpPorts) { 'TCP' } else { 'UDP' }
            LocalAddress = $port.LocalAddress
            LocalPort = $port.LocalPort
            State = $port.State
            PID = $port.OwningProcess
            ProcessName = $processName
            AppliedSetting = $port.AppliedSetting
        }
        $mappedPorts += New-Object PSObject -Property $mappedPort
    }
    return $mappedPorts
}

Write-Host "Retrieving current open ports before opening application..."

$currentOpenPorts = Get-OpenPorts
Read-Host -Prompt "Press any key to continue when application has been opened"

Write-Host "Retrieving open ports afer opening application..."
$newOpenPorts = Get-OpenPorts

$results = @()
$results = Compare-Object -ReferenceObject $currentOpenPorts -DifferenceObject $newOpenPorts -Property Protocol, LocalAddress, LocalPort, State, PID, ProcessName -PassThru

if ($null -eq $results) {
    Write-Host "No new port has been opened"
}
else {
    foreach ($port in $results) {
        if ($port.Protocol -eq 'TCP' -and $port.State -eq 'Listen') {
            Write-Host "Port was opened:" -ForegroundColor Green
            Write-Host "Protocol: $($port.Protocol), Local Address: $($port.LocalAddress), Local Port: $($port.LocalPort), State: $($port.State), PID: $($port.PID), Process Name: $($port.ProcessName)" -ForegroundColor Green
        }
        else {
            Write-Host "Port changed state:" -ForegroundColor Yellow
            Write-Host "Protocol: $($port.Protocol), Local Address: $($port.LocalAddress), Local Port: $($port.LocalPort), State: $($port.State), PID: $($port.PID), Process Name: $($port.ProcessName)" -ForegroundColor Yellow
        }
    }
}