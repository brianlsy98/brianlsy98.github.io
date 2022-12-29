$(document).ready(() => {
    render_projects('all');
})


let render_projects = (slug) => {
    let projects_area = $('.projects-wrapper');

    $('.white-button').removeClass('white-button-hover');
    $(`#${slug}`).addClass('white-button-hover');

    let projects_obj = [
        {
            image: 'assets/images/ModeShiftingADCDR.jpg',
            link: 'https://github.com/brianlsy98/ModeShiftingADCDR',
            title: 'All Digital CDR with locked/unlocked Mode Shifting',
            demo: false,
            technologies: ['XMODEL', 'Verilog', 'Python'],
            description: "Circuit Project for SNU 2022 Fall [Topics in Integrated Circuits (Prof. Jaeha Kim)]. Implemented All Digital CDR with changing Kp/Ki, using simple Counter",
            categories: ['Circuit']
        },
        {
            image: 'assets/images/OfflineRL_picture.png',
            link: 'https://github.com/brianlsy98/MB_OfflineRL_GAN',
            title: 'Model-Based Offline Reinforcement Learning with Generative Adversarial Networks',
            demo: false,
            technologies: ['Python', 'Pytorch', 'Linux'],
            description: "Graduation Project for SNU 2022 Fall (Prof. Songhwai Oh). Implemented Model-based, Offline RL Algorithm with Generative Adversarial Networks, utilizing Constraint as a Discriminator and Policy as a Generator.",
            categories: ['RL']
        },
        {
            image: 'assets/images/IS_project_car.png',
            link: 'https://github.com/brianlsy98/CarRacing_DeepRL',
            title: 'Car Racing Contest',
            demo: false,
            technologies: ['Python', 'Pytorch', 'Keras', 'Linux'],
            description: "RC Car Racing Contest Algorithm implementation (2 co-workers) for SNU 2022 Spring [Introduction to Intelligent Systems (Prof. Songhwai Oh)]. Updated the Agent(Car)'s policy with RL algorithm (Proximal Policy Optimization).",
            categories: ['RL', 'Robotics']
        },
        {
            image: 'assets/images/2022_Spring_RLproject.png',
            link: 'https://github.com/brianlsy98/2022_Spring_RL_project',
            title: 'ChainMDP & Lava Project',
            demo: false,
            technologies: ['Python', 'Pytorch', 'Keras'],
            description: "Project for SNU 2022 Spring [Data Science & Reinforcement Learning (Prof. Min-hwan Oh)]. Implemented deep exploration DQN (ensemble DQN) and PPO with coarse/fine control",
            categories: ['RL']
        },
        {
            image: 'assets/images/IsaacSIM.jpeg',
            link: 'https://github.com/brianlsy98/IssacSim_tutorial',
            title: 'Isaac Sim',
            demo: false,
            technologies: ['Python', 'Pytorch'],
            description: "Isaac Sim (NVIDIA) tutorial with Jackal(4 wheeled vehicle), which is a Robotics Simulation Environment. Isaac Sim supports Domain Randomization skills for Deep Learning trainings, and we can also integrate with Isaac SDK for cartographer/gmapping (SLAM)",
            categories: ['Robotics', 'RL']
        },
        {
            image: 'assets/images/SNUFF.png',
            link: 'https://distrue.io/tag/chatbot/',
            title: 'Restaurant Recommendation Chatbot near SNU',
            demo: false,
            technologies: ['nodeJS', 'AWS', 'mongoDB'],
            description: "Developed a recommendation KakaoTalk chatbot with 2 co-workers(Instagram Account Owner & Backend Developer). Web-crawled(puppeteer) @snu_foodfighter instagram posts to Database(mongoDB), and connected to Kakaotalk API with AWS",
            categories: ['etc']
        },
    ]

    let projects = [];
    if(slug == 'all') {
        projects = projects_obj.map(project_mapper);
    } 
    else {
        projects = projects_obj.filter(project => project.categories.includes(slug)).map(project_mapper);
    }
    projects_area.hide().html(projects).fadeIn();
}

let project_mapper = project => {
    return `
        <div class="wrapper">
                
            <div class="card radius shadowDepth1">
                ${project.image ? 
                    `<div class="card__image border-tlr-radius">
                        <a href="${project.link}">
                            <img src="${project.image}" alt="image" id="project-image" class="border-tlr-radius">
                        </a>
                    </div>`           
                : ''}
        
                <div class="card__content card__padding">
        
                    <article class="card__article">
                        <h2><a href="${project.link}">${project.title}</a></h2>
        
                        <p class="paragraph-text-normal">${project.description} ${project.demo ? `<a href="${project.demo}">Demo</a>` : ''}</p>
                    </article>
                                
                    <div class="card__meta">
                        ${project.technologies.map(tech =>
                            `<span class="project-technology paragraph-text-normal">${tech}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        </div>
    `
}

let selected = (slug) => {
    render_projects(slug);
}
