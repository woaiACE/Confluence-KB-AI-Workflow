from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto('file:///app/confluence AI 工作流.html')

        # Click the master node and take a screenshot
        page.locator('div[onclick="showNode(\'master\')"]').click()
        page.screenshot(path='/home/jules/verification/screenshots/master_node.png')

        # Click the t1_end node and take a screenshot
        page.locator('div[onclick="showNode(\'t1_end\')"]').click()
        page.screenshot(path='/home/jules/verification/screenshots/t1_end_node.png')

        browser.close()

if __name__ == '__main__':
    run()
