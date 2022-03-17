import React, { useState } from 'react';
import { Collapse, Row, Col, Statistic, Card, message, Skeleton, Select } from 'antd';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { GET_COMMON_STATISTICS } from '../../api/statisticApi';
import { GET_ORDERS } from '../../api/orderApi';
import { DATE_US, DATE_VN,MONTH_VN } from '../../constants';
import { Line as LineChart } from 'react-chartjs-2';
import moment from 'moment';
import _ from 'lodash';
import { DELETE_BOOKS } from '../../api/bookApi';
import BestSellerList from '../products/product-list/BestSellerList';
import ListCommon from '../shared/ListCommon';
import { GET_USERS_BASIC } from '../../api/authApi';

const { Panel } = Collapse;
const { Option } = Select;

const BestSellerListWrapper = ListCommon(BestSellerList, undefined, undefined, DELETE_BOOKS);

function Dashboard(props) {

    const { loading: loadingCommonStatistics, data: dataCommonStatistics = { getCommonStatistics: {} } } = useQuery(GET_COMMON_STATISTICS, {
        onError() {
            message.error("Có lỗi xảy ra khi lấy dữ liệu");
        }
    });

    var [timeRange, setTimeRange] = useState("THIS_WEEK");
    var [timeRangeUsers, setTimeRangeUsers] = useState("THIS_WEEK");

    const generateTimeRangeFromString = (timeRange) => {
        let startDate = moment();
        let endDate = moment();
        console.log(timeRange)
        switch (timeRange) {
            case "THIS_WEEK":
                startDate = moment().startOf('week');
                endDate = moment().endOf('week');
                break;
            case "LAST_WEEK":
                startDate = startDate.subtract(1, 'weeks').startOf('week');
                endDate = endDate.subtract(1, 'weeks').endOf('week');
                break;
            case "THIS_MONTH":
                startDate = moment().startOf('month');
                endDate = moment().endOf('month');
                break;
            case "LAST_MONTH":
                startDate = startDate.subtract(1, 'months').startOf('month');
                endDate = endDate.subtract(1, 'months').endOf('month');
                break;
            case "THIS_YEAR":
                startDate = moment().startOf('year');
                endDate = moment().endOf('year');
                break;
            case "LAST_YEAR":
                startDate = startDate.subtract(1, 'years').startOf('year');
                endDate = endDate.subtract(1, 'years').endOf('year');
                break;
            case "LATEST_30_DAYS":
                startDate = startDate.subtract(30,'days');
                break;
            case "LATEST_7_DAYS":
                startDate = startDate.subtract(7,'days');
                break;
        }
        console.log({
            startDate,
            endDate
        })
        return {
            startDate,
            endDate
        }
    }

    const { startDate, endDate } = generateTimeRangeFromString(timeRange);
    const { startDate: startDateUser, endDate: endDateUser } = generateTimeRangeFromString(timeRangeUsers);

    const generateOrderData = (orders = []) => {
        const data = {
            labels: [],
            datasets: [
                {
                    label: 'Đơn hàng',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: '#FF6384',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    id: 'y-axis-0',
                    yAxisID: 'y-axis-0',
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 3,
                    pointStyle: 'circle',
                    pointHitRadius: 10,
                    data: []
                }, {
                    label: 'Doanh thu (VNĐ)',
                    fill: false,
                    lineTension: 0.1,
                    id: 'y-axis-1',
                    yAxisID: 'y-axis-1',
                    backgroundColor: 'rgba(151,187,205,0.5)',
                    borderColor: '#36A2EB',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 3,
                    pointStyle: 'circle',
                    pointHitRadius: 10,
                    data: []
                }
            ]
        };
        let temp = startDate;
        if (timeRange.indexOf('YEAR') >= 0) {
            for (let i =0;i<=11;i++){
                data.labels.push(temp.month(i).format(MONTH_VN));
            }
            var groupedByMonths = _.groupBy(orders, (o) => moment(o.createdAt).format(MONTH_VN));
            var groupedByMonthsUpdated = _.groupBy(orders, (o) => moment(o.updatedAt).format(MONTH_VN));
            for (let label of data.labels) {
                data.datasets[0].data.push(groupedByMonths[label] ? groupedByMonths[label].length : 0);
                data.datasets[1].data.push(groupedByMonthsUpdated[label] ? _.sumBy(groupedByMonthsUpdated[label], 'grandTotal') : 0);
            }
        } else {
            while (temp.isSameOrBefore(endDate)) {
                data.labels.push(temp.format(DATE_VN));
                temp.add(1, 'days');
            }
            var groupedByDays = _.groupBy(orders, (o) => moment(o.createdAt).format(DATE_VN));
            var groupedByDaysUpdated = _.groupBy(orders, (o) => moment(o.updatedAt).format(DATE_VN));
            for (let label of data.labels) {
                data.datasets[0].data.push(groupedByDays[label] ? groupedByDays[label].length : 0);
                data.datasets[1].data.push(groupedByDaysUpdated[label] ? _.sumBy(groupedByDaysUpdated[label], (item)=> item.orderStatus==="Completed"?item.grandTotal:0) : 0);
            }
        }
        return data;
    }

    const generateUserData = (users = []) => {
        const data = {
            labels: [],
            datasets: [
                {
                    label: 'Khách hàng',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: '#464775',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    id: 'y-axis-3',
                    yAxisID: 'y-axis-3',
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 3,
                    pointStyle: 'circle',
                    pointHitRadius: 10,
                    data: []
                }
            ]
        };
        let temp = startDateUser;
        if (timeRangeUsers.indexOf('YEAR') >= 0) {
            for (let i =0;i<=11;i++){
                data.labels.push(temp.month(i).format(MONTH_VN));
            }
            var groupedByMonths = _.groupBy(users, (u) => moment(u.createdAt).format(MONTH_VN));
            for (let label of data.labels) {
                data.datasets[0].data.push(groupedByMonths[label] ? groupedByMonths[label].length : 0);
            }
        } else {
            while (temp.isSameOrBefore(endDateUser)) {
                data.labels.push(temp.format(DATE_VN));
                temp.add(1, 'days');
            }
            var groupedByDays = _.groupBy(users, (u) => moment(u.createdAt).format(DATE_VN));
            for (let label of data.labels) {
                data.datasets[0].data.push(groupedByDays[label] ? groupedByDays[label].length : 0);
            }
        }
        return data;
    }

    const { loading: loadingOrders, data: dataOrders = { getOrders: {} } } = useQuery(GET_ORDERS, {
        onError() {
            message.error("Có lỗi xảy ra khi lấy dữ liệu");
        },
        variables: {
            where: {
                AND: [{ createdAt_gte: startDate.format(DATE_US) }, { createdAt_lte: endDate.add(1,"days").format(DATE_US) }]
            },
            selection: `
                {
                    id
                    grandTotal
                    recipientFullName
                    recipientPhone
                    paymentMethod{
                        id
                        name
                    }
                    shippingMethod{
                        id
                        name
                    }
                    customer{
                        id
                        email
                    }
                    orderStatus
                    paymentStatus
                    createdAt
                    updatedAt
                }
            `
        }
    });

    const { loading: loadingUsers, data: dataUsers = { getUsers: {} } } = useQuery(GET_USERS_BASIC, {
        onError() {
            message.error("Có lỗi xảy ra khi lấy dữ liệu");
        },
        variables: {
            orderBy: 'createdAt_DESC',
            where: {
                AND: [{ createdAt_gte: startDateUser?.format(DATE_US) }, { createdAt_lte: endDateUser?.add(1,"days").format(DATE_US) }]
            },
            selection: `{
                id
                createdAt
            }`
        }
    });

    const data = generateOrderData(dataOrders.getOrders.orders);
    const dataUsersChart = generateUserData(dataUsers.getUsers.users);

    return (
        <div className="content-wrapper">
            <div className={`content-header m-b-20`}>
                <h3>Dashboard</h3>
            </div>
            <div className="content-body">
                <Collapse defaultActiveKey={['1']}>
                    <Panel header={<span><i className="fa fa-area-chart m-r-12"></i><b>Thống kê chung</b></span>} key="1" showArrow={false}>
                        {loadingCommonStatistics ?
                            <Skeleton active /> :
                            <Row gutter={16}>
                                <Col span={6}>
                                    <Card>
                                        <Statistic title="Đơn hàng" value={dataCommonStatistics.getCommonStatistics.orders} prefix={<i className="fa fa-shopping-cart"></i>} />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card>
                                        <Statistic title="Khách hàng đăng ký" value={dataCommonStatistics.getCommonStatistics.customers} prefix={<i className="fa fa-users"></i>} />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card>
                                        <Statistic title="Doanh thu" value={dataCommonStatistics.getCommonStatistics.income}
                                            suffix="đ" prefix={<i className="fa fa-money"></i>} />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card>
                                        <Statistic title="Sắp hết hàng" value={dataCommonStatistics.getCommonStatistics.lowStocks}
                                            prefix={<i className="fa fa-archive"></i>} />
                                    </Card>
                                </Col>
                            </Row>}
                    </Panel>
                    <Panel header={<span><i className="fa fa-line-chart m-r-12"></i><b>Đơn hàng và doanh thu</b></span>} key="2" showArrow={false}>
                        <div>
                            <label>Hiển thị dữ liệu cho: </label> &nbsp;
                            <Select style={{ width: 150 }} value={timeRange} onChange={(val) => setTimeRange(val)}>
                                <Option value="THIS_WEEK">Tuần này</Option>
                                <Option value="LAST_WEEK">Tuần trước</Option>
                                <Option value="THIS_MONTH">Tháng này</Option>
                                <Option value="LAST_MONTH">Tháng trước</Option>
                                <Option value="THIS_YEAR">Năm nay</Option>
                                <Option value="LAST_YEAR">Năm trước</Option>
                                <Option value="LATEST_30_DAYS">30 ngày gần nhất</Option>
                                <Option value="LATEST_7_DAYS">7 ngày gần nhất</Option>
                            </Select>
                        </div>
                        <LineChart height={100} options={{
                            tooltips: {
                                callbacks: {
                                    label: (tooltipItem)=>{
                                        
                                        if (tooltipItem.datasetIndex===0){
                                            return "Đơn hàng: " + Intl.NumberFormat().format(tooltipItem.yLabel);
                                        }else{
                                            return "Doanh thu: " + Intl.NumberFormat().format(tooltipItem.yLabel) +"đ";
                                        }
                                      
                                    }
                                }
                            },
                            scales: {
                                xAxes: [{
                                    stacked: false
                                }],
                                yAxes: [{
                                    stacked: false,
                                    position: "left",
                                    id: "y-axis-0",
                                    ticks: {
                                        beginAtZero: true,
                                        userCallback: function(label, index, labels) {
                                            // when the floored value is the same as the value we have a whole number
                                            if (Math.floor(label) === label) {
                                                return label;
                                            }
                       
                                        },
                                    }
                                }, {
                                    stacked: false,
                                    position: "right",
                                    id: "y-axis-1",
                                    scaleLabel: {
                                        callback(value) {
                                            return Intl.NumberFormat().format(value) + "đ";
                                        }
                                    },
                                    ticks: {
                                        beginAtZero: true,
                                        callback(value) {
                                            return Intl.NumberFormat().format(value) + "đ";
                                        }
                                    }
                                }]
                            }
                        }} data={data}>

                        </LineChart>
                    </Panel>
                    <Panel header={<span><i className="fa fa-users m-r-12"></i><b>Khách hàng</b></span>} key="4" showArrow={false}>
                        <div>
                            <label>Hiển thị dữ liệu cho: </label> &nbsp;
                            <Select style={{ width: 150 }} value={timeRangeUsers} onChange={(val) => setTimeRangeUsers(val)}>
                                <Option value="THIS_WEEK">Tuần này</Option>
                                <Option value="LAST_WEEK">Tuần trước</Option>
                                <Option value="THIS_MONTH">Tháng này</Option>
                                <Option value="LAST_MONTH">Tháng trước</Option>
                                <Option value="THIS_YEAR">Năm nay</Option>
                                <Option value="LAST_YEAR">Năm trước</Option>
                                <Option value="LATEST_30_DAYS">30 ngày gần nhất</Option>
                                <Option value="LATEST_7_DAYS">7 ngày gần nhất</Option>
                            </Select>
                        </div>
                        <LineChart height={100} options={{
                            tooltips: {
                                callbacks: {
                                    label: (tooltipItem)=>{
                                        
                                        if (tooltipItem.datasetIndex===0){
                                            return "Khách hàng: " + Intl.NumberFormat().format(tooltipItem.yLabel);
                                        }
                                    }
                                }
                            },
                            scales: {
                                xAxes: [{
                                    stacked: false
                                }],
                                yAxes: [{
                                    stacked: false,
                                    position: "left",
                                    id: "y-axis-3",
                                    ticks: {
                                        beginAtZero: true,
                                        userCallback: function(label, index, labels) {
                                            // when the floored value is the same as the value we have a whole number
                                            if (Math.floor(label) === label) {
                                                return label;
                                            }
                                        },
                                    }
                                }]
                            }
                        }} data={dataUsersChart}>
                        </LineChart>
                    </Panel>
                    <Panel header={<span><i className="fa fa-star m-r-12"></i><b>Sách bán chạy</b></span>} key="3" showArrow={false}>
                        <BestSellerListWrapper standAlone={true}/>
                    </Panel>
                </Collapse>
            </div>
        </div>
    )

}

export default Dashboard;