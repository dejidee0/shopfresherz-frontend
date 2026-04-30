import { Button } from "@/components/ui/Button";
import { title } from "process";

const notificationTemplates = [
  {
    tempId: "1",
    title: "Order Confirmed",
    emailSubject: "Your order {{order_id}} has been confirmed!",
    emailBody:
      "Hi {{customer_name}}, \n \n Thank you for your order! We're excited to let you know that your order #{{order_id}} has been confirmed and is now being prepared for shipment. \n\n Order Summary:\nTotal: {{total}}\nTracking Number: {{tracking_number}} \n\n We'll send you another update as soon as your package is on its way.",
  },
   {
    tempId: "2",
    title: "Order Shipped",
    emailSubject: "Your order {{order_id}} has been confirmed!",
    emailBody:
      "Hi {{customer_name}}, \n \n Thank you for your order! We're excited to let you know that your order #{{order_id}} has been confirmed and is now being prepared for shipment. \n\n Order Summary:\nTotal: {{total}}\nTracking Number: {{tracking_number}} \n\n We'll send you another update as soon as your package is on its way.",
  },
  {
    tempId: "3",
    title: "Order Delivered",
    emailSubject: "Your order {{order_id}} has been confirmed!",
    emailBody:
      "Hi {{customer_name}}, \n \n Thank you for your order! We're excited to let you know that your order #{{order_id}} has been confirmed and is now being prepared for shipment. \n\n Order Summary:\nTotal: {{total}}\nTracking Number: {{tracking_number}} \n\n We'll send you another update as soon as your package is on its way.",
  },
    {
    tempId: "4",
    title: "Refund Initiated",
    emailSubject: "Your order {{order_id}} has been confirmed!",
    emailBody:
      "Hi {{customer_name}}, \n \n Thank you for your order! We're excited to let you know that your order #{{order_id}} has been confirmed and is now being prepared for shipment. \n\n Order Summary:\nTotal: {{total}}\nTracking Number: {{tracking_number}} \n\n We'll send you another update as soon as your package is on its way.",
  },
];

const NotificationConfig = () => {
  return (
    <div className="rounded-md border border-border p-4 flex flex-1 flex-col gap-4">
      <p className=" font-semibold">Notification Templates</p>
      <div className="flex flex-col gap-5 mb-2 md:mb-6">
        {notificationTemplates.map((template)=>(
            <div key={template.tempId} className="flex flex-1 justify-between bg-gray-200 rounded-md p-3">
                <p className="text-sm md:text-base">{template.title}</p>
                <button className="text-xs md:text-sm hover:text-primary cursor-pointer">Edit</button>
            </div>
        ))}
      </div>
      <Button className="text-xs md:text-sm w-fit rounded-md">Save Settings</Button>
    </div>
  );
};

export default NotificationConfig;
